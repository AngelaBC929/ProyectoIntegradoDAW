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
  photos: any[] = [];
  votedPhotos: Set<number> = new Set();

  constructor(private photoService: PhotoService, private router: Router) { }

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos() {
    this.photoService.getFotosAprobadas().subscribe({
      next: (response) => {
        console.log('Fotos aprobadas:', response);
        this.photos = response.photos || [];
        this.loadVotedPhotos();
      },
      error: (err) => {
        console.error('Error al cargar fotos aprobadas:', err);
      }
    });
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

        const photo = this.photos.find(p => p.id === photoId);
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

  goBackToHome(): void {
    this.router.navigate(['home']);
  }
}
