import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PhotoService } from '../../shared/services/photo.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mis-fotos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './mis-fotos.component.html',
  styleUrls: ['./mis-fotos.component.css']
})
export class MisFotosComponent implements OnInit {
  tabActivo: string = 'misfotos';
  usuario: User | null = null;
  fotos: any[] = [];
  rallySeleccionado: any = null;
  isModalOpen: boolean = false;
  imagePreview?: string;
  selectedFile: File | null = null;
  isEditModalOpen: boolean = false;
  selectedPhoto: any = null;
  editForm!: FormGroup;
  userId: number = 0;
  fotosAprobadas: { [rallyId: number]: boolean } = {};

  @ViewChild('editFileInput') editFileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private photoService: PhotoService,
    private router: Router,
    private sweetAlert: SweetAlertService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const idStr = localStorage.getItem('userId');
    if (idStr) {
      this.userId = parseInt(idStr, 10);
      this.loadPhotos();
      this.loadAprobadas();
    } else {
      this.sweetAlert.info('Usuario no encontrado.');
      this.router.navigate(['/login']);
    }
  }

  seleccionarTab(tab: string): void {
    this.tabActivo = tab;
  }

  loadPhotos(): void {
    this.photoService.getFotosUsuarioActuales(this.userId).subscribe({
      next: (response: { photos: any[] }) => {
        this.fotos = (response?.photos || []).map(photo => ({
          ...photo,
          photo_url: `${environment.apiUrl}/${photo.photo_url}?t=${Date.now()}`
        }));
      },
      error: (err: any) => {
        console.error('Error al cargar las fotos:', err);
        this.sweetAlert.warning('Error al cargar las fotos.');
      }
    });
  }

  loadAprobadas(): void {
    this.photoService.getFotosAprobadasPorUsuario(this.userId).subscribe({
      next: (rallyIds: number[]) => {
        rallyIds.forEach(rid => {
          this.photoService.getFotosAprobadas(rid, this.userId).subscribe((aprobadas: boolean) => { 
            this.fotosAprobadas[rid] = aprobadas;
          });
        });
      },
      error: (err: any) => {
        console.error('Error al obtener rallies con fotos aprobadas:', err);
      }
    });
  }

  deletePhoto(photoId: number): void {
    const photo = this.fotos.find(p => p.id === photoId);
    if (!photo) return this.sweetAlert.warning('Foto no encontrada');

    if (photo.status === 'aprobada') {
      this.sweetAlert.warning('No se puede eliminar una foto que ya fue aprobada.');
      return;
    }

    this.sweetAlert.confirm('¿Estás seguro?', 'Esta acción eliminará la foto permanentemente.')
      .then(confirmed => {
        if (confirmed) {
          this.photoService.deletePhoto(photoId, this.userId).subscribe({
            next: () => {
              this.fotos = this.fotos.filter(p => p.id !== photoId);
              this.sweetAlert.success('¡Foto eliminada correctamente!');
            },
            error: (err: any) => {
              console.error('Error al eliminar la foto:', err);
              this.sweetAlert.warning('Error al eliminar la foto.');
            }
          });
        }
      });
  }

  editPhoto(photo: any): void {
    this.selectedPhoto = { ...photo };
    this.imagePreview = photo.photo_url;
    this.selectedFile = null;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedPhoto = null;
    this.imagePreview = undefined;
    this.selectedFile = null;
  }

onSaveEdit(): void {
  const inputEl = this.editFileInput?.nativeElement;
  let fileToSend: File | undefined = undefined;

 if (inputEl && inputEl.files && inputEl.files.length > 0) {
  fileToSend = inputEl.files[0];
}

  this.photoService.editPhoto(
    this.userId,
    this.selectedPhoto.id,
    this.selectedPhoto.title.trim(),
    fileToSend
  ).subscribe({
    next: (res) => {
      const index = this.fotos.findIndex(p => p.id === this.selectedPhoto.id);

      if (index !== -1) {
        // Reemplazamos el objeto entero para que Angular lo detecte
        this.fotos[index] = {
          ...this.fotos[index],
          title: this.selectedPhoto.title,
          status: this.fotos[index].status === 'rechazada' ? 'pendiente' : this.fotos[index].status,
          photo_url: `${res.photo_url}?t=${Date.now()}`
        };

        // Actualizar el modal y vista previa
        this.selectedPhoto = { ...this.fotos[index] };
        this.imagePreview = this.selectedPhoto.photo_url;
      }

      this.sweetAlert.success('Foto actualizada correctamente');
      this.closeEditModal();
      this.loadPhotos();
    },
    error: (err) => {
      console.error("Error al editar:", err);
      this.sweetAlert.warning("Error al editar la foto");
    }
  });
  

}


 onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    // EXTRA: poner como título el nombre del archivo sin extensión
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    this.selectedPhoto.title = nameWithoutExt;

    // Mostrar vista previa
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

  openEditModal(rally: any): void {
    this.isModalOpen = true;
    this.rallySeleccionado = rally;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.imagePreview = undefined;
    this.selectedFile = null;
  }

  onSubmit(): void {
    if (this.rallySeleccionado && this.selectedFile) {
      this.photoService.uploadPhoto(this.selectedFile, this.userId, this.rallySeleccionado.id, this.rallySeleccionado.title).subscribe({
        next: () => {
          this.sweetAlert.success('Foto subida correctamente');
          this.closeModal();
          this.loadPhotos();
        },
        error: (err) => {
          console.error('Error al subir la foto:', err);
          this.sweetAlert.warning('Error al subir la foto');
        }
      });
    } else {
      this.sweetAlert.info('Por favor selecciona una foto y un rally.');
    }
  }

  volverADashboard(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/user/dashboard']);
    });
  }

  entrarGaleria(): void {
    this.router.navigate(['/gallery'], { queryParams: { from: 'dashboard' } });
  }

  goBackToUserPanel(): void {
    this.router.navigate(['/user/dashboard']);
  }
}
