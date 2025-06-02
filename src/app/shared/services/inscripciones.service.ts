import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class InscripcionesService {
  private baseUrl = 'http://localhost/backendRallyFotografico';

  constructor(private http: HttpClient) {}

  // Obtener las inscripciones de un usuario
  obtenerInscripciones(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/inscripciones.php?userId=${userId}`);
  }
  
}
