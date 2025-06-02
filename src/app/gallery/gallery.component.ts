import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../shared/services/photo.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule], // Añadir módulos necesarios si es necesario
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  photos: any[] = [];  // Fotos aprobadas
  votedPhotos: number[] = [];  // Fotos votadas por el usuario

  constructor(private http: HttpClient, private photoService: PhotoService, private router: Router) {}

  ngOnInit() {
    // Cargar fotos aprobadas desde el servicio
    this.photoService.getFotosAprobadas().subscribe({
      next: (response) => {
        this.photos = response.photos || []; // Asegúrate que la propiedad se llama 'photos'
      },
      error: (err) => {
        console.error('Error al cargar fotos aprobadas:', err);
      }
    });

    // Cargar las fotos que el usuario ya ha votado (de localStorage)
    this.loadVotedPhotos();
  }

  // Cargar fotos votadas desde el localStorage
  loadVotedPhotos() {
    const stored = localStorage.getItem('votedPhotos');
    this.votedPhotos = stored ? JSON.parse(stored) : [];
  }

  // Verificar si el usuario ya votó por la foto
  hasVoted(photoId: number): boolean {
    return this.votedPhotos.includes(photoId);
  }

  // Función para votar una foto
  vote(photoId: number) {
    const userId = localStorage.getItem('userId');

    // Verificar si el usuario está autenticado
    if (!userId) {
      alert('Debes iniciar sesión para votar.');
      return;
    }

    // Verificar si ya ha votado por la foto
    if (this.hasVoted(photoId)) {
      alert('Ya has votado esta foto.');
      return;
    }

    // Realizar la petición POST para registrar el voto
    this.http.post('http://localhost/backendRallyFotografico/votar_foto.php', {
      photo_id: photoId,
      userId: parseInt(userId)
    }).subscribe({
      next: () => {
        // Actualizar votos en la interfaz
        const photo = this.photos.find(p => p.id === photoId);
        if (photo) photo.votes++;

        // Guardar en localStorage las fotos votadas
        this.votedPhotos.push(photoId);
        localStorage.setItem('votedPhotos', JSON.stringify(this.votedPhotos));
        alert('¡Voto registrado!');
      },
      error: (err) => {
        alert('Error al votar: ' + (err.error?.error || 'Intenta más tarde'));
      }
    });
  }

  // Función para navegar hacia la página de inicio
  goBackToHome(): void {
    this.router.navigate(['home']);
  }
}
