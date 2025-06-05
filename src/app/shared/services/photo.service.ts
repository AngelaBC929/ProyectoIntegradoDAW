import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';




@Injectable({ providedIn: 'root' })
export class PhotoService {
  // private apiUrl = 'http://localhost/backendRallyFotografico/fotos.php';
  private apiUrl = `${environment.apiUrl}/fotos.php`;
  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error?.error || error.message));
  }

  constructor(private http: HttpClient) { }

  uploadPhoto(photo: File | string, userId: number, rallyId: number, title: string): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo instanceof File ? photo : '');
    formData.append('userId', userId.toString());
    formData.append('rallyId', rallyId.toString());
    formData.append('title', title);
    formData.append('action', 'upload');

    return this.http.post(this.apiUrl, formData).pipe(
      catchError(this.handleError));
  }

  getFotosPorUsuario(userId: number): Observable<any> {
    const params = { action: 'getByUser', userId: userId.toString() };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getFotosPorRallyYUsuario(rallyId: number, userId: number): Observable<any> {
    const params = {
      rallyId: rallyId.toString(),
      userId: userId.toString(),
      action: 'getByRallyAndUser'
    };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getFotosUsuarioActuales(userId: number): Observable<any> {
    const params = {
      userId: userId.toString(),
      action: 'getUserPhotosActuales'
    };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deletePhoto(photoId: number, userId: number): Observable<any> {
    const data = new FormData();
    data.append('photo_id', photoId.toString());
    data.append('userId', userId.toString());
    data.append('action', 'delete');

    return this.http.post(this.apiUrl, data).pipe(
      catchError(this.handleError.bind(this))
    );
  }

 editPhoto(userId: number, photoId: number, title: string, photo?: File): Observable<any> {
  const formData = new FormData();
  formData.append('action', 'edit');
  formData.append('userId', userId.toString());
  formData.append('photo_id', photoId.toString());
  formData.append('title', title);

  if (photo) {
    formData.append('photo', photo);
  }

  return this.http.post<any>(this.apiUrl, formData);
}

  // FUNCIÓN CORRECTA PARA VOTAR
  vote(photoId: number, userId: number): Observable<any> {
    const body = {
      action: 'vote',
      photo_id: photoId,
      userId: userId,
    };
    return this.http.post(this.apiUrl, body).pipe(
      catchError(this.handleError.bind(this)));
  }


  getAllPhotos(): Observable<any> {
    const params = { action: 'getAllPhotos' };
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(this.handleError.bind(this)));
  }


  updatePhotoStatus(photoId: number, newStatus: 'aprobada' | 'rechazada'): Observable<any> {
    const data = new FormData();
    data.append('photo_id', photoId.toString());
    data.append('status', newStatus);
    data.append('action', 'updateStatus');

    return this.http.post(this.apiUrl, data).pipe(
      catchError(this.handleError.bind(this)));
  }

  // FUNCIÓN CORRECTA PARA OBTENER LAS FOTOS APROBADAS
  getFotosAprobadasPaginated(page: number, limit: number): Observable<any> {
    const params = {
      action: 'getApprovedPhotos',
      limit: limit.toString(),
      offset: ((page - 1) * limit).toString()
    };

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(this.handleError.bind(this)));
  }

  getFotosAprobadas(rallyId: number, userId: number): Observable<boolean> {
    const url = `${this.apiUrl}?action=getApprovedPhotos&rallyId=${rallyId}&userId=${userId}`;
    return this.http.get<{ aprobadas: boolean }>(url).pipe(
      map(response => response.aprobadas),
      catchError(error => {
        console.error('Error al comprobar fotos aprobadas:', error);
        return of(false); 
      })
    );
  }
  getFotosAprobadasPorUsuario(userId: number): Observable<number[]> {
  const params = {
    action: 'getApprovedPhotosByUser',
    userId: userId.toString()
  };

  return this.http.get<{ ralliesConFotoAprobada: number[] }>(this.apiUrl, { params }).pipe(
  map(res => res.ralliesConFotoAprobada),
  catchError(this.handleError.bind(this))
);

}

}
