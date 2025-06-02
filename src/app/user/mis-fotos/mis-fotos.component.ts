import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Asegúrate de tener la URL base aquí
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
  photos: any[] = [];
  isEditing: boolean = false;
  editTitle: string = '';
  selectedPhotoId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    const userId = 1; // Reemplaza con el ID real del usuario logueado
    const rallyId = 1; // Reemplaza con el rallyId real

    this.http.get<{ photos: any[] }>(
      `http://localhost/backendRallyFotografico/fotos.php?userId=${userId}&rallyId=${rallyId}`
    ).subscribe(response => {
      this.photos = response.photos;
    });
  }

  editPhoto(photo: any): void {
    this.isEditing = true;
    this.editTitle = photo.title;
    this.selectedPhotoId = photo.id;
  }

  saveEdit(): void {
    if (this.selectedPhotoId !== null) {
      const userId = 1;
      const photoId = this.selectedPhotoId;
      const title = this.editTitle;

      this.http.post<{ success: boolean; message?: string }>(
        'http://localhost/backendRallyFotografico/fotos.php',
        {
          action: 'edit',
          userId: userId,
          photo_id: photoId,
          title: title
        }
      ).subscribe(response => {
        if (response.success) {
          this.loadPhotos();
          this.isEditing = false;
        }
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  deletePhoto(photoId: number): void {
    const userId = 1;

    this.http.post<{ success: boolean; message?: string }>(
      'http://localhost/backendRallyFotografico/fotos.php',
      {
        action: 'delete',
        userId: userId,
        photo_id: photoId
      }
    ).subscribe(response => {
      if (response.success) {
        this.loadPhotos();
      }
    });
  }

  votePhoto(photoId: number): void {
    const userId = 1;

    this.http.post<{ success: boolean; message?: string }>(
      'http://localhost/backendRallyFotografico/fotos.php',
      {
        action: 'vote',
        userId: userId,
        photo_id: photoId
      }
    ).subscribe(response => {
      if (response.success) {
        alert('Votación exitosa');
      }
    });
  }
}
