import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../shared/services/photo.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-fotos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-fotos.component.html',
  styleUrls: ['./mis-fotos.component.css']
})
export class MisFotosComponent implements OnInit {
  fotos: any[] = [];
  rallySeleccionado: any;
  isModalOpen = false;
  imagePreview: string | undefined;
  selectedFile: File | null = null;

  isEditModalOpen = false;
  selectedPhoto: any = null;

  userId: number = 0;// Definir el userId de forma explícita, ajusta según sea necesario

  constructor(private photoService: PhotoService, private router: Router) {}

  ngOnInit(): void {
    const idStr = localStorage.getItem('userId');
    if (idStr) {
      this.userId = parseInt(idStr, 10);
      this.loadPhotos();
    } else {
      alert('Usuario no encontrado');
      this.router.navigate(['/login']);
    }
  }
  
  loadPhotos(): void {
    this.photoService.getFotosUsuarioActuales(this.userId).subscribe({
      next: (response: { photos: any[]; }) => {
        this.fotos = response?.photos || [];
      },
      error: (err: any) => {
        console.error('Error al cargar las fotos:', err);
        alert('Error al cargar las fotos');
      }
    });
  }
  
  
  deletePhoto(photoId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta foto?')) {
      this.photoService.deletePhoto(photoId, this.userId).subscribe({
        next: () => {
          this.fotos = this.fotos.filter(photo => photo.id !== photoId);
          alert('Foto eliminada correctamente');
        },
        error: (err: any) => {
          console.error('Error al eliminar la foto:', err);
          alert('Error al eliminar la foto');
        }
      });
    }
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
    if (this.selectedPhoto && this.selectedPhoto.title) {
      const fileToSend = this.selectedFile ? this.selectedFile : null;

      this.photoService.editPhoto(this.userId, this.selectedPhoto.id, this.selectedPhoto.title)
        .subscribe({
          next: () => {
            alert('Foto editada correctamente');
            this.loadPhotos(); // Recarga las fotos después de editar
            this.closeEditModal();  // Cierra el modal de edición
          },
          error: (err) => {
            console.error('Error al editar la foto:', err);
            alert('Error al editar la foto');
          }
        });
    } else {
      alert('Por favor ingresa un título');
    }
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
          alert('Foto subida correctamente');
          this.closeModal();
          this.loadPhotos();
        },
        error: (err) => {
          console.error('Error al subir la foto:', err);
          alert('Error al subir la foto');
        }
      });
    } else {
      alert('Selecciona una imagen primero');
    }
  }

  goBackToUserPanel(): void {
    this.router.navigate(['/user/dashboard']);
  }
}
