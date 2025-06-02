import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, catchError, map, tap } from 'rxjs';
import { Rally } from '../models/rally.model';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RallyService {
  private apiUrl = 'http://localhost/backendRallyFotografico/rallies.php';
  private apiInscripcionesUrl = 'http://localhost/backendRallyFotografico/inscripciones.php'; // URL para inscripciones
  private apiUploadPhotosUrl = 'http://localhost/backendRallyFotografico/fotos.php'; // URL para subir fotos

  // Creamos un BehaviorSubject para almacenar los rallies
  private ralliesSubject = new BehaviorSubject<Rally[]>([]);

  // Exponemos un observable para que los componentes puedan suscribirse
  rallies$ = this.ralliesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllRallies(): Observable<Rally[]> {
    return this.http.get<Rally[]>(this.apiUrl).pipe(
      tap((rallies) => {
        this.ralliesSubject.next(rallies); // No filtramos, mostramos todos
      }),
      catchError((error) => {
        console.error('Error al obtener rallies:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Método para crear un rally
  createRally(rallyData: any): Observable<any> {
    return this.http.post(this.apiUrl, rallyData).pipe(
      tap((newRally) => {
        const currentRallies = this.ralliesSubject.value || [];
        this.ralliesSubject.next([...currentRallies, newRally as Rally]);
      }),
      catchError((error) => {
        console.error('Error al crear rally:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Método para actualizar un rally
  updateRally(id: number, rallyData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}`, rallyData).pipe(
      tap((updatedRally) => {
        const currentRallies = this.ralliesSubject.value || [];
        const index = currentRallies.findIndex((rally) => rally.id === id);
        if (index !== -1) {
          currentRallies[index] = updatedRally as Rally;
          this.ralliesSubject.next([...currentRallies]);
        }
      }),
      catchError((error) => {
        console.error('Error al actualizar rally:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Método para obtener un rally por su ID
  getRallyById(id: number): Observable<Rally> {
    return this.http.get<Rally>(`${this.apiUrl}?id=${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener rally por ID:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Método para eliminar un rally
  deleteRally(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(
      tap(() => {
        const currentRallies = this.ralliesSubject.value || [];
        const updatedRallies = currentRallies.filter((rally) => rally.id !== id);
        this.ralliesSubject.next(updatedRallies);
      }),
      catchError((error) => {
        console.error('Error al eliminar rally:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  getUserInscriptions(userId: number): Observable<number[]> {
    return this.http.get<{ success: boolean; data: number[] }>(`${this.apiInscripcionesUrl}?user_id=${userId}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Error al obtener inscripciones del usuario:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  apuntarseARally(rallyId: number, userId: number): Observable<any> {
    const body = { rallyId, userId };
    return this.http.post<any>(this.apiInscripcionesUrl, body).pipe(
      map((response) => {
        if (response && response.success) {
          return response;
        } else {
          throw new Error(response.message || 'Error al intentar apuntarse al rally');
        }
      }),
      catchError((error) => {
        console.error('Error al apuntarse al rally:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  cancelarInscripcion(rallyId: number): Observable<any> {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (!userId) {
      console.error('No se ha encontrado un usuario autenticado.');
      return EMPTY; // Retorna un observable vacío
    }
    return this.cancelarInscripcionBackend(rallyId, userId);
  }

  private cancelarInscripcionBackend(rallyId: number, userId: number): Observable<any> {
    const body = { rallyId, userId };
    return this.http.post<any>(this.apiInscripcionesUrl, body).pipe(
      catchError((error) => {
        console.error('Error al cancelar inscripción:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  uploadPhotos(rallyId: number, photos: File[]): Observable<any> {
    const formData = new FormData();
    photos.forEach((photo) => formData.append('photos[]', photo, photo.name));

    // Validar que las fotos sean de un tipo adecuado
    photos.forEach((photo) => {
      if (!photo.type.startsWith('image/')) {
        console.error('El archivo no es una imagen');
        throw new Error('Solo se pueden subir imágenes.');
      }
    });

    return this.http.post<any>(`${this.apiUploadPhotosUrl}?rally_id=${rallyId}`, formData).pipe(
      catchError((error) => {
        console.error('Error al subir fotos:', error);
        return throwError(() => new Error(error));
      })
    );
  }
}
