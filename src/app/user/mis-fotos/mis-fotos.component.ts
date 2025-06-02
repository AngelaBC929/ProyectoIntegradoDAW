import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../shared/services/photo.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-fotos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mis-fotos.component.html',
  styleUrls: ['./mis-fotos.component.css']
})
export class MisFotosComponent implements OnInit {
  tabActivo: string = 'misfotos'; // o el valor correcto que manejes
  usuario: User | null = null;
  fotos: any[] = [];
  rallySeleccionado: any;
  isModalOpen = false;
  imagePreview: string | undefined;
  selectedFile: File | null = null;
  isEditModalOpen = false;
  selectedPhoto: any = null;

  userId: number = 0;// Definir el userId de forma explícita, ajusta según sea necesario
  @ViewChild('editFileInput') editFileInput!: ElementRef<HTMLInputElement>;
  constructor(private photoService: PhotoService, private router: Router, private sweetAlert: SweetAlertService) {}

  ngOnInit(): void {
    const idStr = localStorage.getItem('userId');
    if (idStr) {
      this.userId = parseInt(idStr, 10);
      this.loadPhotos();
    } else {
      this.sweetAlert.info('Usuario no encontrado.');
      this.router.navigate(['/login']);
    }
  }
    seleccionarTab(tab: string) {
    this.tabActivo = tab;
  }

  
  loadPhotos(): void {
    this.photoService.getFotosUsuarioActuales(this.userId).subscribe({
      next: (response: { photos: any[]; }) => {
        this.fotos = response?.photos || [];
      },
      error: (err: any) => {
        console.error('Error al cargar las fotos:', err);
        this.sweetAlert.warning('Error al cargar las fotos.');
      }
    });
  }
  
 deletePhoto(photoId: number): void {
  this.sweetAlert.confirm('¿Estás seguro?', 'Esta acción eliminará la foto permanentemente.')
    .then((confirmed) => {
      if (confirmed) {
        this.photoService.deletePhoto(photoId, this.userId).subscribe({
          next: () => {
            this.fotos = this.fotos.filter(photo => photo.id !== photoId);
            this.sweetAlert.success('¡Foto eliminada correctamente!');
          },
          error: (err: any) => {
            console.error('Error al eliminar la foto:', err);
            this.sweetAlert.warning('Error al eliminar la foto:', err);
          }
        });
      }
    });
}


  // Abre el modal de edición
  editPhoto(photo: any): void {
    this.selectedPhoto = { ...photo }; // Copia para editar
    this.imagePreview = photo.photo_url;
    this.selectedFile = null; // limpia archivo anterior
    this.isEditModalOpen = true;
  }

  // Cierra el modal de edición
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedPhoto = null;
    this.imagePreview = undefined;
    this.selectedFile = null;
  }

  // Actualiza título y opcionalmente la imagen
  onSaveEdit(): void {
    let fileToSend: File | undefined = undefined;
  
    const inputEl = this.editFileInput?.nativeElement;
    if (inputEl && inputEl.files?.length) {
      fileToSend = inputEl.files[0];
    }
  
    this.photoService.editPhoto(
      this.userId,
      this.selectedPhoto.id,
      this.selectedPhoto.title,
      fileToSend
    ).subscribe({
      next: () => {
        this.sweetAlert.success('Foto actualizada correctamente');
        this.closeEditModal();
        this.loadPhotos();
      },
      error: (err) => {
        console.error("Error al editar:", err.message);
      }
    });
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.imagePreview = URL.createObjectURL(file);
    }
  }

  // Modal para nueva carga (no edición)
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
volverADashboard() {
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/user/dashboard']);
  });
}

  entrarGaleria() {
  this.router.navigate(['/gallery'], { queryParams: { from: 'dashboard' } });
}

  goBackToUserPanel(): void {
    this.router.navigate(['/user/dashboard']);
  }
}
