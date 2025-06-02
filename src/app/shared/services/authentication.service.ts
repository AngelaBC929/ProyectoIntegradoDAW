import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = 'http://localhost/backendRallyFotografico';
  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  role$ = this.roleSubject.asObservable();
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
username$ = this.usernameSubject.asObservable();


  // 🆕 Modal y timeout
  private timeout: any;
  private readonly TIMEOUT_LIMIT = 15 * 60 * 1000; // 15 minutos
  private sessionExpiredSubject = new Subject<void>();
  sessionExpired$ = this.sessionExpiredSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login.php`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        this.setRole(response.role);
        this.setUsername(response.username);  // ✅ Aquí
        localStorage.setItem('userId', response.id);
  
        this.startTimeout();
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.error || 'Error de login'));
      })
    );
  }
  
  logout() {
    localStorage.removeItem('authToken');
    this.setRole(null);
    this.setUsername(null);  // ✅ Aquí
    localStorage.removeItem('userId');
    clearTimeout(this.timeout);
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // 🆕 Iniciar temporizador de inactividad
  startTimeout() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.logout(); // 🔐 cerrar sesión al expirar
      this.sessionExpiredSubject.next(); // 🔔 emitir evento para mostrar el modal
    }, this.TIMEOUT_LIMIT);
  }

  // 🆕 Resetear temporizador (cuando hay actividad del usuario)
  resetTimeout() {
    if (this.isAuthenticated()) {
      this.startTimeout();
    }
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  setUsername(username: string | null) {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
    this.usernameSubject.next(username);
  }
  
  getUsername(): string | null {
    return this.usernameSubject.getValue();
  }
  
  register(email: string, username: string, password: string, name: string, lastName: string, birthdate: string) {
    const userData = { email, username, password, name, lastName, birthdate };
    return this.http.post<any>(`${this.apiUrl}/usuarios.php`, userData).pipe(
      tap(response => console.log("Usuario registrado con éxito:", response)),
      catchError(error => {
        return throwError(() => new Error(error.error?.error || 'Error al registrar usuario'));
      })
    );
  }

  setRole(role: string | null) {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
    this.roleSubject.next(role);
  }

  getRole(): string | null {
    return this.roleSubject.getValue();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
