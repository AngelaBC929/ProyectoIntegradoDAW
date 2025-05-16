import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators'; // Asegúrate de que switchMap esté importado
import { Rally } from '../models/rally.model';

@Injectable({
  providedIn: 'root',
})
export class RallyService {
  private apiUrl = 'http://localhost/backendRallyFotografico/rallies.php'; // Cambia esto si es diferente
  private ralliesSubject = new BehaviorSubject<Rally[]>([]); // BehaviorSubject para emitir cambios
  public rallies$ = this.ralliesSubject.asObservable(); // Observable para que los componentes se suscriban

  constructor() {}

  // Crear un nuevo rally
  createRally(rally: Rally): Observable<any> {
    console.log("Creando rally con los siguientes datos:", rally); // Verifica los datos que estás enviando
    return this.fetchPost(rally).pipe(
      switchMap(() => {
        // Después de crear el rally, obtenemos la lista de rallies actualizada
        return this.getAllRallies(); // Llama a getAllRallies
      }),
      tap((rallies) => {
        console.log("Rallies actualizados:", rallies); // Verifica que los rallies están siendo actualizados
      })
    );
  }
  

  // Obtener todos los rallies
  getAllRallies(): Observable<Rally[]> {
    return this.fetchGet().pipe(
      tap((rallies) => {
        console.log("Recibiendo los rallies actualizados:", rallies); // Verifica la lista de rallies que se recibe
        this.ralliesSubject.next(rallies); // Emitir los rallies a los suscriptores
      })
    );
  }
  
  getRallyById(id: number): Observable<Rally | null> {
    const url = `${this.apiUrl}?id=${id}`;  // URL correctamente construida
    console.log('Fetching rally from URL:', url);  // Verifica que la URL sea correcta
  
    return this.fetchGetByUrl(url).pipe(
      map((response: any) => {
        console.log('Rally recibido:', response);  // Verifica la respuesta recibida
        return response ? response : null;  // Si la respuesta no es null, devuelve el rally
      })
    );
  }
  
  // Actualizar un rally
  updateRally(id: number, rally: Rally): Observable<any> {
    return this.fetchPut(id, rally).pipe(
      tap(() => {
        // Después de actualizar el rally, actualizar la lista de rallies
        this.getAllRallies().subscribe();
      })
    );
  }

  // Eliminar un rally
  deleteRally(id: number): Observable<any> {
    return this.fetchDelete(id).pipe(
      tap(() => {
        // Después de eliminar el rally, actualizar la lista de rallies
        this.getAllRallies().subscribe();
      })
    );
  }

  // Método general para realizar GET con fetch (todos los rallies)
  private fetchGet(): Observable<Rally[]> {
    return new Observable<Rally[]>((observer) => {
      fetch(this.apiUrl)
        .then((response) => response.json())
        .then((data) => {
          observer.next(data); // Emitimos los datos
          observer.complete(); // Terminamos la emisión
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          observer.next([]); // Emitimos un array vacío si hay error
          observer.complete(); // Terminamos la emisión
        });
    });
  }

  // Método para realizar GET con fetch usando URL específica (para un solo rally)
  private fetchGetByUrl(url: string): Observable<Rally[]> {
    return new Observable<Rally[]>((observer) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          observer.next(data); // Emitimos los datos
          observer.complete(); // Terminamos la emisión
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          observer.next([]); // Emitimos un array vacío si hay error
          observer.complete(); // Terminamos la emisión
        });
    });
  }

  // Método para realizar POST con fetch
  private fetchPost(rally: Rally): Observable<any> {
    return new Observable<any>((observer) => {
      fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rally),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Respuesta del backend:', data); // Aquí ves la respuesta del backend
          observer.next(data); // Emitimos los datos
          observer.complete(); // Terminamos la emisión
        })
        .catch((error) => {
          console.error('Error posting data:', error);
          observer.next(null); // Emitimos null si hay error
          observer.complete(); // Terminamos la emisión
        });
    });
  }
  
  // Método para realizar PUT con fetch
  private fetchPut(id: number, rally: Rally): Observable<any> {
    return new Observable<any>((observer) => {
      fetch(`${this.apiUrl}?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rally),
      })
        .then((response) => response.json())
        .then((data) => {
          observer.next(data); // Emitimos los datos
          observer.complete(); // Terminamos la emisión
        })
        .catch((error) => {
          console.error('Error updating data:', error);
          observer.next(null); // Emitimos null si hay error
          observer.complete(); // Terminamos la emisión
        });
    });
  }

  // Método para realizar DELETE con fetch
  private fetchDelete(id: number): Observable<any> {
    return new Observable<any>((observer) => {
      fetch(`${this.apiUrl}?id=${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          observer.next(data); // Emitimos los datos
          observer.complete(); // Terminamos la emisión
        })
        .catch((error) => {
          console.error('Error deleting data:', error);
          observer.next(null); // Emitimos null si hay error
          observer.complete(); // Terminamos la emisión
        });
    });
  }
}
