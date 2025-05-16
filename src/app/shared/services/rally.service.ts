import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

  constructor(private http: HttpClient) { }

  getAllRallies(): Observable<Rally[]> {
    return this.http.get<Rally[]>(this.apiUrl).pipe(
      tap((rallies) => {
        // Actualizamos el BehaviorSubject con todos los rallies recibidos
        this.ralliesSubject.next(rallies);
      })
    );
  }
  

  apuntarseARally(rallyId: number): Observable<any> {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
  
    if (!userId) {
      console.error('No se ha encontrado un usuario autenticado.');
      return new Observable(); 
    }
  
    console.log('Intentando apuntarse al rally', rallyId, 'con usuario', userId);
  
    return this.apuntarseARallyBackend(rallyId, userId).pipe(
      tap((response) => {
        console.log('Respuesta del servidor al apuntarse:', response);
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
    return this.http.post<any>(this.apiInscripcionesUrl, body);
  }

  // Método para cancelar la inscripción
cancelarInscripcion(rallyId: number): Observable<any> {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('No se ha encontrado un usuario autenticado.');
    return new Observable(); // Si no hay userId, no hacemos la solicitud
  }

  // Llamamos al backend para cancelar la inscripción
  return this.cancelarInscripcionBackend(rallyId, parseInt(userId, 10)).pipe(
    tap((response: CancelResponse) => {
      if (response.success) {
        this.removeInscriptionFromLocalStorage(rallyId); // Eliminamos la inscripción del localStorage
        alert('Inscripción cancelada correctamente');
      }
    })
  );
}


  // Eliminar inscripción del localStorage
  private removeInscriptionFromLocalStorage(rallyId: number): void {
    let inscriptions = JSON.parse(localStorage.getItem('inscriptions') || '[]');
    inscriptions = inscriptions.filter((id: number) => id !== rallyId);
    localStorage.setItem('inscriptions', JSON.stringify(inscriptions));
  }

  // Método para hacer la solicitud de cancelación de inscripción
  private cancelarInscripcionBackend(rallyId: number, userId: number): Observable<any> {
    const body = { rallyId, userId };
    return this.http.post<any>(`${this.apiInscripcionesUrl}/cancelar`, body); // Petición POST para cancelar
  }

// Método para crear un rally
createRally(rallyData: any): Observable < any > {
  return this.http.post(this.apiUrl, rallyData).pipe(
    tap((newRally) => {
      // Aseguramos que el rally se cree correctamente y lo agregamos a la lista
      const currentRallies = this.ralliesSubject.value || [];
      this.ralliesSubject.next([...currentRallies, newRally as Rally]);
    })
  );
}

// Método para actualizar un rally
updateRally(id: number, rallyData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}?id=${id}`, rallyData).pipe(
    tap((updatedRally) => {
      // Buscamos el rally que se va a actualizar en la lista
      const currentRallies = this.ralliesSubject.value || [];
      const index = currentRallies.findIndex(rally => rally.id === id);
      if (index !== -1) {
        currentRallies[index] = updatedRally as Rally; // Actualizamos el rally en el array
        this.ralliesSubject.next([...currentRallies]); // Actualizamos el estado del Subject
      }
    })
  );
}
// Método para obtener un rally por su ID
getRallyById(id: number): Observable<Rally> {
  return this.http.get<Rally>(`${this.apiUrl}?id=${id}`);
}
// Método para eliminar un rally
deleteRally(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}?id=${id}`).pipe(
    tap(() => {
      // Actualizamos el BehaviorSubject después de la eliminación
      const currentRallies = this.ralliesSubject.value || [];
      const updatedRallies = currentRallies.filter(rally => rally.id !== id);
      this.ralliesSubject.next(updatedRallies);
    })
  );
}
getUserInscriptions(userId: number): Observable<number[]> {
  return this.http.get<{ success: boolean, inscritos: number[] }>(`http://localhost/backendRallyFotografico/inscripciones.php?userId=${userId}`)
    .pipe(map((res: { inscritos: any; }) => res.inscritos));
}

}
// Interfaz para tipar la respuesta de cancelación
interface CancelResponse {
  success: boolean;
  message?: string;
}
