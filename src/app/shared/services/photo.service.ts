import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private apiUrl = 'http://localhost/backendRallyFotografico/fotos.php'; // Asegúrate de que la URL apunte al archivo correcto

  constructor(private http: HttpClient) {}
  uploadPhoto(photo: File, userId: number, rallyId: number) {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('userId', userId.toString());
    formData.append('rallyId', rallyId.toString());
    formData.append('action', 'upload');
  
    return this.http.post(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.error || error.message;
        return throwError(() => new Error(message));
      })
    );
  }
  
  

  // Otros métodos relacionados con la votación de fotos y aprobación
  votePhoto(userId: number, photoId: number) {
    const data = new FormData();
    data.append('userId', userId.toString());
    data.append('photo_id', photoId.toString());
    data.append('action', 'vote');  // Acción para votar

    return this.http.post(`${this.apiUrl}`, data);  // Realiza la solicitud de votación
  }
}
