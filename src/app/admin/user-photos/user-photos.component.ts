import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

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
    console.log('Enviando solicitud con estos datos: ', {
      action: 'approve_or_reject',
      photo_id: this.selectedPhoto.id,
      status: status
    });

    this.http.post('http://localhost/backendRallyFotografico/fotos.php', {
      action: 'approve_or_reject',
      photo_id: this.selectedPhoto.id,
      status: status
    })
    .subscribe((response: any) => {
      if (response.success) {
        // Actualizamos el estado en la foto seleccionada
        this.selectedPhoto.status = status;
        this.selectedPhoto.isReviewed = true; // Marcamos la foto como revisada

        // También actualizamos el estado de esa foto en allPhotos
        const updatedIndex = this.allPhotos.findIndex(photo => photo.id === this.selectedPhoto.id);
        if (updatedIndex !== -1) {
          this.allPhotos[updatedIndex].status = status; // Actualizamos el estado de la foto en la lista
        }

        // Cerramos el modal después de actualizar el estado
        this.closeModal();
      } else {
        console.error('Error al actualizar el estado de la foto');
      }
    }, (error) => {
      console.error('Error en la solicitud HTTP', error);
    });
  } else {
    console.error('No se ha seleccionado ninguna foto');
  }
}
// Método para redirigir al usuario al panel de usuario
goBackToAdminPanel(): void {
  this.router.navigate(['admin']); 
}
  
}
