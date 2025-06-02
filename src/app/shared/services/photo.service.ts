import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private apiUrl = 'http://localhost/backendRallyFotografico/fotos.php'; // Asegúrate de que la URL apunte al archivo correcto

  constructor(private http: HttpClient) {}

  uploadPhoto(photo: File, userId: number, rallyId: number) {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('user_id', userId.toString());
    formData.append('rally_id', rallyId.toString());
    formData.append('action', 'upload');  // Se indica que la acción es subir foto

    return this.http.post(this.apiUrl, formData);  // Realiza la solicitud POST al backend
  }

  // Otros métodos relacionados con la votación de fotos y aprobación
  votePhoto(userId: number, photoId: number) {
    const data = new FormData();
    data.append('user_id', userId.toString());
    data.append('photo_id', photoId.toString());
    data.append('action', 'vote');  // Acción para votar

    return this.http.post(`${this.apiUrl}`, data);  // Realiza la solicitud de votación
  }
}
