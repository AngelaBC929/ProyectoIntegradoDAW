import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = 'http://localhost/backendRallyFotografico'; // ⚠️ Asegúrate de que esto coincide con tu XAMPP
  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('userRole'));
  role$ = this.roleSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login.php`, { username, password }).pipe(
      tap(response => {
        // Guardar el token, rol, username y userId en localStorage
        localStorage.setItem('authToken', response.token);
        this.setRole(response.role);
        localStorage.setItem('username', response.username); // si quieres usarlo en alguna parte
        localStorage.setItem('userId', response.id); // Guardar el ID del usuario en localStorage
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.error || 'Error de login'));
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;  // Obtener el userId desde localStorage
  }

  register(email: string, username: string, password: string, name: string, lastName: string, birthdate: string) {
    // Preparamos los datos que se enviarán al backend
    const userData = {
      email,
      username,
      password,
      name,
      lastName,
      birthdate
    };
  
    // Realizamos el POST al backend para registrar al usuario
    return this.http.post<any>(`${this.apiUrl}/usuarios.php`, userData).pipe(
      tap(response => {
        // Aquí podrías hacer algo adicional, como guardar un mensaje de éxito si lo deseas
        console.log("Usuario registrado con éxito:", response);
      }),
      catchError(error => {
        // Capturamos cualquier error que se pueda dar y lo pasamos a la función de error
        return throwError(() => new Error(error.error?.error || 'Error al registrar usuario'));
      })
    );
  }
  setRole(role: string | null) {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
    this.roleSubject.next(role);
  }
  
  getRole(): string | null {
    return this.roleSubject.getValue();
  }
  
}
