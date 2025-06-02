import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../shared/services/photo.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  rallies: {
    id: number;
    title: string;
    start_date?: string;
    end_date?: string;
    photos: any[];
  }[] = [];

  votedPhotos: Set<number> = new Set();
  currentPage: number = 1; // Página global
  limit: number = 6; // Fotos por página
  totalPhotos: number = 0; // Total de fotos, para calcular las páginas

  constructor(private photoService: PhotoService, private router: Router) {}

  ngOnInit() {
    this.loadRallies();
  }

 loadRallies() {
  this.photoService.getFotosAprobadasPaginated(this.currentPage, this.limit).subscribe({
    next: (response) => {
      console.log('Fotos aprobadas:', response);
      this.rallies = this.groupPhotosByRally(response.photos || []); // Agrupa las fotos por rally
      this.totalPhotos = response.totalPhotos || 0; // Establece el total de fotos para la paginación
      this.loadVotedPhotos();
    },
    error: (err) => {
      console.error('Error al cargar fotos aprobadas:', err);
    }
  });
}


  groupPhotosByRally(photos: any[]): any[] {
    const grouped: { [key: number]: any } = {};

    photos.forEach(photo => {
      const rallyId = photo.rally_id;
      if (!grouped[rallyId]) {
        grouped[rallyId] = {
          id: rallyId,
          title: photo.rally_title || 'Rally sin nombre',
          start_date: photo.rally_start_date,
          end_date: photo.rally_end_date,
          photos: []
        };
      }
      grouped[rallyId].photos.push(photo);
    });

    return Object.values(grouped);
  }

  loadVotedPhotos() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const votedPhotos = localStorage.getItem(`userVotedPhotos_${userId}`);
      if (votedPhotos) {
        this.votedPhotos = new Set(JSON.parse(votedPhotos));
      }
    }
  }

  hasVoted(photoId: number): boolean {
    return this.votedPhotos.has(photoId);
  }

  vote(photoId: number) {
    const userId = localStorage.getItem('userId');
    const parsedUserId = parseInt(userId || '', 10);

    if (!userId || isNaN(parsedUserId)) {
      alert('Debes iniciar sesión para votar.');
      return;
    }

    if (this.hasVoted(photoId)) {
      alert('Ya has votado por esta foto.');
      return;
    }

    this.photoService.vote(photoId, parsedUserId).subscribe({
      next: (response) => {
        console.log('Voto registrado correctamente:', response);

        const photo = this.findPhotoById(photoId);
        if (photo) {
          photo.votos = (photo.votos || 0) + 1;
        }

        this.votedPhotos.add(photoId);
        localStorage.setItem(`userVotedPhotos_${userId}`, JSON.stringify(Array.from(this.votedPhotos)));

        alert('¡Voto registrado!');
      },
      error: (err) => {
        console.error('Error al votar:', err);
        alert('Error al votar: ' + (err.error?.error || 'Intenta más tarde'));
      }
    });
  }

  findPhotoById(photoId: number): any | null {
    for (let rally of this.rallies) {
      const photo = rally.photos.find(p => p.id === photoId);
      if (photo) return photo;
    }
    return null;
  }

  // Funciones de paginación global
  nextPage() {
  if ((this.currentPage * this.limit) < this.totalPhotos) {
    this.currentPage++;
    this.loadRallies(); // Carga la siguiente página
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadRallies(); // Carga la página anterior
  }
}

hasMorePhotos(): boolean {
  return (this.currentPage * this.limit) < this.totalPhotos; // Verifica si hay más fotos
}

  goBackToHome(): void {
    this.router.navigate(['home']);
  }
}
