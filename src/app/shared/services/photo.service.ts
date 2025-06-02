import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';



@Injectable({ providedIn: 'root' })
export class PhotoService {
  // private apiUrl = 'http://localhost/backendRallyFotografico/fotos.php';
  private apiUrl = `${environment.apiUrl}/fotos.php`;


  constructor(private http: HttpClient) {}

  uploadPhoto(photo: File | string, userId: number, rallyId: number, title: string): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo instanceof File ? photo : '');
    formData.append('userId', userId.toString());
    formData.append('rallyId', rallyId.toString());
    formData.append('title', title);
    formData.append('action', 'upload');

    return this.http.post(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error?.error || error.message)))
    );
  }

  getFotosPorUsuario(userId: number): Observable<any> {
    const params = { action: 'getByUser', userId: userId.toString() };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error?.error || error.message)))
    );
  }

  getFotosPorRallyYUsuario(rallyId: number, userId: number): Observable<any> {
    const params = {
      rallyId: rallyId.toString(),
      userId: userId.toString(),
      action: 'getByRallyAndUser'
    };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error?.error || error.message)))
    );
  }

  getFotosUsuarioActuales(userId: number): Observable<any> {
    const params = {
      userId: userId.toString(),
      action: 'getUserPhotosActuales'
    };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error?.error || error.message)))
    );
  }

  deletePhoto(photoId: number, userId: number): Observable<any> {
    const data = new FormData();
    data.append('photo_id', photoId.toString());
    data.append('userId', userId.toString());
    data.append('action', 'delete');

    return this.http.post(this.apiUrl, data).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error?.error || error.message)))
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
      catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error?.error || error.message)))
    );
  }

  // ✅ FUNCIÓN CORRECTA PARA VOTAR
  vote(photoId: number, userId: number): Observable<any> {
    const body = {
      action: 'vote',
      photo_id: photoId,
      userId: userId,
    };
    return this.http.post(this.apiUrl, body).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error?.error || error.message)))
    );
  }
 

  getAllPhotos(): Observable<any> {
  const params = { action: 'getAllPhotos' };
  return this.http.get<any>(this.apiUrl, { params }).pipe(
    catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error?.error || error.message)))
  );
}


  updatePhotoStatus(photoId: number, newStatus: 'aprobada' | 'rechazada'): Observable<any> {
    const data = new FormData();
    data.append('photo_id', photoId.toString());
    data.append('status', newStatus);
    data.append('action', 'updateStatus');

    return this.http.post(this.apiUrl, data).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error?.error || error.message)))
    );
  }

  // ✅ FUNCIÓN CORRECTA PARA OBTENER LAS FOTOS APROBADAS CON PÁGINACIÓN
getFotosAprobadasPaginated(page: number, limit: number): Observable<any> {
  const params = {
    action: 'getApprovedPhotos',
    limit: limit.toString(),
    offset: ((page - 1) * limit).toString()
  };

  return this.http.get<any>(this.apiUrl, { params }).pipe(
    catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error?.error || error.message)))
  );
}
}
