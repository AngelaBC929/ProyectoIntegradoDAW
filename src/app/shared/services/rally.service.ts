import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Rally } from '../models/rally.model';

@Injectable({
  providedIn: 'root',
})
export class RallyService {
  private apiUrl = 'http://localhost/backendRallyFotografico/rallies.php';
  private apiInscripcionesUrl = 'http://localhost/backendRallyFotografico/inscripciones.php'; // URL del backend para inscripciones

  // Creamos un BehaviorSubject para almacenar los rallies
  private ralliesSubject = new BehaviorSubject<Rally[]>([]);

  // Exponemos un observable para que los componentes puedan suscribirse
  rallies$ = this.ralliesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Método para obtener todos los rallies
  getAllRallies(): Observable<Rally[]> {
    return this.http.get<Rally[]>(this.apiUrl).pipe(
      tap((rallies) => {
        const currentDate = new Date(); // Fecha actual
        // Filtramos los rallies para que solo se muestren los que son actuales o futuros
        const currentRallies = rallies.filter(rally => new Date(rally.start_date) >= currentDate);
        
        // Actualizamos el BehaviorSubject con los rallies filtrados
        this.ralliesSubject.next(currentRallies);
      })
    );
  }
  

  // Método para inscribirse a un rally
  apuntarseARally(rallyId: number): Observable<any> {
    const userId = localStorage.getItem('userId'); // Obtener el userId desde localStorage

    if (!userId) {
      console.error('No se ha encontrado un usuario autenticado.');
      return new Observable(); // Si no hay userId, no hacemos la solicitud
    }

    console.log('User ID:', userId); // Verifica que el userId sea correcto

    // Llamar al método backend con rallyId y userId usando HttpClient
    return this.apuntarseARallyBackend(rallyId, parseInt(userId, 10)).pipe(
      tap((response) => {
        // Si la inscripción es exitosa, guarda la inscripción en localStorage
        if (response.success) {
          this.saveInscriptionToLocalStorage(rallyId);
        }
      })
    );
  }

  // Guardar la inscripción en localStorage
  private saveInscriptionToLocalStorage(rallyId: number): void {
    let inscriptions = JSON.parse(localStorage.getItem('inscriptions') || '[]');
    if (!inscriptions.includes(rallyId)) {
      inscriptions.push(rallyId);
    }
    localStorage.setItem('inscriptions', JSON.stringify(inscriptions));
  }

  // Obtener las inscripciones del usuario
  getInscripciones(): number[] {
    return JSON.parse(localStorage.getItem('inscriptions') || '[]');
  }

  // Método para hacer la solicitud de inscripción
  private apuntarseARallyBackend(rallyId: number, userId: number): Observable<any> {
    const body = { rallyId, userId };

    // Usamos HttpClient para hacer la solicitud POST en lugar de fetch
    return this.http.post<any>(this.apiInscripcionesUrl, body);
  }

  // Método para eliminar un rally
  deleteRally(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(
      tap(() => {
        // Asegurarnos de que currentRallies no sea undefined o vacío
        const currentRallies = this.ralliesSubject.value || []; // Usamos un array vacío por defecto si es undefined
        const updatedRallies = currentRallies.filter(rally => rally.id !== id);
        this.ralliesSubject.next(updatedRallies); // Actualizamos el estado con la nueva lista
      })
    );
  }

  // Método para crear un rally
  createRally(rallyData: any): Observable<any> {
    return this.http.post(this.apiUrl, rallyData).pipe(
      tap((newRally) => {
        // Aseguramos de que currentRallies no sea undefined o vacío
        const currentRallies = this.ralliesSubject.value || []; // Usamos un array vacío por defecto si es undefined
        this.ralliesSubject.next([...currentRallies, newRally as Rally]); // Agregamos el nuevo rally a la lista
      })
    );
  }

  // Método para obtener un rally por su ID
  getRallyById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?id=${id}`);
  }

  // Método para actualizar un rally
  updateRally(id: number, rallyData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}`, rallyData).pipe(
      tap((updatedRally) => {
        // Aseguramos de que currentRallies no sea undefined o vacío
        const currentRallies = this.ralliesSubject.value || []; // Usamos un array vacío por defecto si es undefined
        const index = currentRallies.findIndex(rally => rally.id === id);
        if (index !== -1) {
          currentRallies[index] = updatedRally as Rally;
          this.ralliesSubject.next([...currentRallies]); // Actualizamos el rally en la lista
        }
      })
    );
  }
}
