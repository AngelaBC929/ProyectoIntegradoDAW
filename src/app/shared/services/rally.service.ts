import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Rally } from '../models/rally.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RallyService {
  private apiUrl = `${environment.apiUrl}/rallies.php`;
  private apiInscripcionesUrl = `${environment.apiUrl}/inscripciones.php`;
  private apiUploadPhotosUrl = `${environment.apiUrl}/fotos.php`;

  private ralliesSubject = new BehaviorSubject<Rally[]>([]);
  rallies$ = this.ralliesSubject.asObservable();

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
    return this.http.post(this.apiUrl, rallyData, { observe: 'response' }).pipe(
      tap((res) => {
        const newRally = res.body as Rally;
        const currentRallies = this.ralliesSubject.value || [];
        this.ralliesSubject.next([...currentRallies, newRally]);
      }),
      catchError((error) => {
        console.error('Error al crear rally:', error);
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }

  updateRally(id: number, rallyData: any): Observable<any> {
  // Añadimos el action 'update' en el body para que el backend sepa qué hacer
  const body = { ...rallyData, action: 'update', id };

  return this.http.post(this.apiUrl, body).pipe(
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
  // Enviamos un POST con action 'delete' y el id para eliminar
  const body = { action: 'delete', id };

  return this.http.post(this.apiUrl, body).pipe(
    tap(() => {
      const currentRallies = this.ralliesSubject.value || [];
      this.ralliesSubject.next(currentRallies.filter((r) => r.id !== id));
    }),
    catchError((error) => {
      console.error('Error al eliminar rally:', error);
      return throwError(() => new Error(error));
    })
  );
}
  loadUserInscriptions(userId: number): void {
    this.http.get<any>(`${this.apiInscripcionesUrl}?userId=${userId}`).pipe(
      tap(response => console.log('Respuesta inscripciones:', response)),
      map((response) => Array.isArray(response.inscritos) ? response.inscritos.map((r: any) => r.id) : []),
      catchError((error) => {
        console.error('Error al cargar inscripciones:', error);
        return of([]);
      })
    ).subscribe({
      next: (ids) => this.userInscriptionsSubject.next(ids),
      error: () => this.userInscriptionsSubject.next([])
    });
  }

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
          this.loadUserInscriptions(userId);
        }
      }),
      map(response => response),
      catchError((error) => {
        console.error('Error HTTP o conexión:', error);
        return throwError(() => ({
          success: false,
          message: error.message || 'Error de conexión o servidor'
        }));
      })
    );
  }

  cancelarInscripcion(rallyId: number): Observable<any> {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (!userId) {
      console.error('Usuario no autenticado.');
      return of(null);
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
    photos.forEach(photo => formData.append('photos[]', photo, photo.name));

    // Validar tipo de archivo
    for (const photo of photos) {
      if (!photo.type.startsWith('image/')) {
        console.error('Solo se pueden subir imágenes.');
        throw new Error('Solo se pueden subir imágenes.');
      }
    }

    return this.http.post<any>(`${this.apiUploadPhotosUrl}?rallyId=${rallyId}`, formData).pipe(
      catchError((error) => {
        console.error('Error al subir fotos:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  getFotosSubidas(rallyId: number, userId: number): Observable<number> {
    const url = `${this.apiInscripcionesUrl}?rallyId=${rallyId}&userId=${userId}`;
    return this.http.get<{ count: number }>(url).pipe(
      map(response => response.count || 0),
      catchError(error => {
        console.error('Error al obtener fotos subidas:', error);
        return of(0);
      })
    );
  }
}
