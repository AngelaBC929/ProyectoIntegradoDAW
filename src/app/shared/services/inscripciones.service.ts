import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InscripcionesService {
  private apiInscripcionesUrl = `${environment.apiUrl}/inscripciones.php`;

  constructor(private http: HttpClient) {}

  // Obtener las inscripciones de un usuario (GET)
  obtenerInscripciones(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiInscripcionesUrl}?userId=${userId}`);
  }

  // Registrar o cancelar inscripción (POST)
  gestionarInscripcion(rallyId: number, userId: number): Observable<any> {
    const body = { rallyId, userId };
    return this.http.post<any>(this.apiInscripcionesUrl, body);
  }
}
