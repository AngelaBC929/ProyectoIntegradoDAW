import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private apiUrl = 'http://localhost/backendRallyFotografico/fotos.php';  // Ajusta la URL de tu backend

  constructor(private http: HttpClient) {}

  uploadPhoto(photo: File | string, userId: number, rallyId: number, title: string): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo instanceof File ? photo : ''); // Si es un archivo, se agrega
    formData.append('userId', userId.toString());
    formData.append('rallyId', rallyId.toString());
    formData.append('title', title); // Asegúrate de pasar el título también
    formData.append('action', 'upload');

    return this.http.post(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.error || error.message;
        return throwError(() => new Error(message));
      })
    );
  }

  getFotosPorUsuario(userId: number): Observable<any> {
    const params = { action: 'getByUser', userId: userId.toString() };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.error || error.message;
        return throwError(() => new Error(message));
      })
    );
  }

  getFotosPorRallyYUsuario(rallyId: number, userId: number): Observable<any> {
    const params = {
      rallyId: rallyId.toString(),
      userId: userId.toString(),
      action: 'getByRallyAndUser'
    };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.error || error.message;
        return throwError(() => new Error(message));
      })
    );
  }

  deletePhoto(photoId: number, userId: number): Observable<any> {
    const data = new FormData();
    data.append('photo_id', photoId.toString());
    data.append('userId', userId.toString());  // Asegúrate de pasar el userId
    data.append('action', 'delete');
  
    return this.http.post(`${this.apiUrl}`, data).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.error || error.message;
        return throwError(() => new Error(message));
      })
    );
  }

  editPhoto(userId: number, photoId: number, title: string, file?: File): Observable<any> {
    const data = new FormData();
    data.append('userId', userId.toString());
    data.append('photo_id', photoId.toString());
    data.append('title', title);
    data.append('action', 'edit');
  
    if (file) {
      data.append('photo', file);
    }
  
    return this.http.post(this.apiUrl, data).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.error || error.message;
        return throwError(() => new Error(message));
      })
    );
  }

  votePhoto(userId: number, photoId: number): Observable<any> {
    const data = new FormData();
    data.append('userId', userId.toString());
    data.append('photo_id', photoId.toString());
    data.append('action', 'vote');

    return this.http.post(`${this.apiUrl}`, data).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.error || error.message;
        return throwError(() => new Error(message));
      })
    );
  }
}
