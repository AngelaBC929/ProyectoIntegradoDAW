import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule], // Add necessary imports here if needed
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  photos: any[] = [];
  votedPhotos: number[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadVotedPhotos();

    this.http.get<any[]>('http://localhost/backendRallyFotografico/obtener_fotos.php')
      .subscribe({
        next: (data) => {
          this.photos = data;
        },
        error: (err) => {
          console.error('Error al cargar las fotos:', err);
        }
      });
  }

  loadVotedPhotos() {
    const stored = localStorage.getItem('votedPhotos');
    this.votedPhotos = stored ? JSON.parse(stored) : [];
  }

  hasVoted(photoId: number): boolean {
    return this.votedPhotos.includes(photoId);
  }

  vote(photoId: number) {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Debes iniciar sesión para votar.');
      return;
    }

    if (this.hasVoted(photoId)) {
      alert('Ya has votado esta foto.');
      return;
    }

    this.http.post('http://localhost/backendRallyFotografico/votar_foto.php', {
      photo_id: photoId,
      user_id: parseInt(userId)
    }).subscribe({
      next: () => {
        const photo = this.photos.find(p => p.id === photoId);
        if (photo) photo.votes++;

        this.votedPhotos.push(photoId);
        localStorage.setItem('votedPhotos', JSON.stringify(this.votedPhotos));
        alert('¡Voto registrado!');
      },
      error: (err) => {
        alert('Error al votar: ' + (err.error?.error || 'Intenta más tarde'));
      }
    });
  }

  goBackToHome(): void {
    this.router.navigate(['home']); 
  }
}
