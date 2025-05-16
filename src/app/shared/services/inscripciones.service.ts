import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {
  private baseUrl = 'http://localhost/backendRallyFotografico';

  constructor(private http: HttpClient) {}

  // Obtener las inscripciones de un usuario
  obtenerInscripciones(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/inscripciones.php`, { userId });
  }

  // Obtener todos los rallies
  obtenerRallies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rallies.php`);
  }

  // Cancelar la inscripción de un usuario a un rally
//   cancelarInscripcion(userId: number, rallyId: number): Observable<any> {
//     return this.http.post(`${this.baseUrl}/cancelar_inscripcion.php`, { userId, rallyId });
//   }

  // Verificar si un usuario está inscrito en un rally
//   verificarInscripcion(userId: number, rallyId: number): Observable<any> {
//     return this.http.post(`${this.baseUrl}/verificar_inscripcion.php`, { userId, rallyId });
//   }
}
