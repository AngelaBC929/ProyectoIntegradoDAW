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
  private apiInscripcionesUrl = 'http://localhost/backendRallyFotografico/inscripciones.php';
  private apiUploadPhotosUrl = 'http://localhost/backendRallyFotografico/fotos.php';

  private ralliesSubject = new BehaviorSubject<Rally[]>([]);
  rallies$ = this.ralliesSubject.asObservable();

  // 🔥 BehaviorSubject para inscripciones
  private userInscriptionsSubject = new BehaviorSubject<number[]>([]);
  userInscriptions$ = this.userInscriptionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllRallies(): Observable<Rally[]> {
    return this.http.get<Rally[]>(this.apiUrl).pipe(
      tap((rallies) => this.ralliesSubject.next(rallies)),
      catchError((error) => {
        console.error('Error al obtener rallies:', error);
        return throwError(() => new Error(error));
      })
    );
  }

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

  getRallyById(id: number): Observable<Rally> {
    return this.http.get<Rally>(`${this.apiUrl}?id=${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener rally por ID:', error);
        return throwError(() => new Error(error));
      })
    );
  }

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

  // ✅ Método unificado para cargar y propagar inscripciones
  loadUserInscriptions(userId: number): void {
    this.http.get<any>(`${this.apiUrl}?userId=${userId}`).pipe(
      tap(response => console.log('Respuesta del servidor:', response)), // Ver la respuesta aquí
      map((response) => {
        return Array.isArray(response.inscritos) ? response.inscritos.map((r: any) => r.id) : [];
      }),
      catchError((err) => {
       // console.error('Error al cargar inscripciones:', err);
        return []; // evitar reventar
      })
    ).subscribe({
      next: (ids) => this.userInscriptionsSubject.next(ids),
      error: () => this.userInscriptionsSubject.next([])
    });
  }
  

  // ✅ Alternar inscripción y actualizar inscripciones del usuario
  toggleInscripcion(rallyId: number, userId: number, actualmenteInscrito: boolean): Observable<any> {
    const body = {
      rallyId,
      userId,
      action: actualmenteInscrito ? 'desinscribir' : 'inscribir'
    };

    return this.http.post<any>(this.apiInscripcionesUrl, body, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap((response) => {
        if (response.success) {
          // 🔁 Actualiza inscripciones
          this.loadUserInscriptions(userId);
        }
      }),
      map((response) => {
        if (response.success) {
          return response;
        } else {
          throw new Error(response.message || 'Error al alternar inscripción');
        }
      }),
      catchError((error) => {
        console.error('Error al alternar inscripción:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // No necesario si usas `toggleInscripcion`, pero lo dejo por si lo usas en otro sitio
  cancelarInscripcion(rallyId: number): Observable<any> {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (!userId) {
      console.error('No se ha encontrado un usuario autenticado.');
      return EMPTY;
    }
    return this.cancelarInscripcionBackend(rallyId, userId);
  }

  private cancelarInscripcionBackend(rallyId: number, userId: number): Observable<any> {
    const body = {
      rallyId,
      userId,
      action: 'desinscribir'
    };

    return this.http.post<any>(this.apiInscripcionesUrl, body, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Error al cancelar inscripción:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  uploadPhotos(rallyId: number, photos: File[]): Observable<any> {
    const formData = new FormData();
    photos.forEach((photo) => formData.append('photos[]', photo, photo.name));

    photos.forEach((photo) => {
      if (!photo.type.startsWith('image/')) {
        console.error('El archivo no es una imagen');
        throw new Error('Solo se pueden subir imágenes.');
      }
    });

    return this.http.post<any>(`${this.apiUploadPhotosUrl}?rallyId=${rallyId}`, formData).pipe(
      catchError((error) => {
        console.error('Error al subir fotos:', error);
        return throwError(() => new Error(error));
      })
    );
  }
}
