import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-photos',
  standalone: true,
  imports: [CommonModule, FormsModule], // Aquí puedes importar otros módulos si es necesario
  templateUrl: './user-photos.component.html',
  styleUrls: ['./user-photos.component.css']
})
export class UserPhotosComponent implements OnInit {
  allPhotos: any[] = [];       // Lista de fotos
  isModalOpen: boolean = false; // Para controlar la apertura del modal
  selectedPhoto: any = null;    // Foto seleccionada para revisar

  constructor(private http: HttpClient) {}

  // Al iniciar el componente, cargamos las fotos
  ngOnInit(): void {
    this.loadPhotos();
  }

  // Método para cargar todas las fotos desde el backend
  loadPhotos() {
    this.http.get('http://localhost/backendRallyFotografico/fotos.php?action=getAllPhotos')
      .subscribe((response: any) => {
        if (response.photos) {
          this.allPhotos = response.photos;
        } else {
          console.error('No se encontraron fotos');
        }
      }, (error) => {
        console.error('Error al cargar fotos', error);
      });
  }

  // Método para abrir el modal con la foto seleccionada
  openModal(photo: any) {
    this.selectedPhoto = photo;
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedPhoto = null; // Limpiar la foto seleccionada
  }

  // Método para actualizar el estado de la foto (Aprobar/Rechazar)
  updatePhotoStatus(status: string) {
    if (this.selectedPhoto) {
      // Aquí se podría hacer una llamada al backend para actualizar el estado
      console.log(`Foto ${this.selectedPhoto.id} actualizada a estado: ${status}`);
      
      // Simulamos una actualización en el estado, por ejemplo, directamente en la vista
      this.selectedPhoto.status = status;

      // Llamada para cerrar el modal después de actualizar el estado
      this.closeModal();
    } else {
      console.error('No se ha seleccionado ninguna foto');
    }
  }
}
