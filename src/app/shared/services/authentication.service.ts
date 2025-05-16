import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Asegúrate de importar HttpClient
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = 'https://api.example.com'; // URL de tu API

  constructor(private http: HttpClient) {}
  
//LO COMENTO PARA PROBAR SIN EL BACKEND
  // login(username: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
  //     .pipe(
  //       tap(response => {//tap es un operador de rxjs que permite ejecutar efectos secundarios (como guardar el token y el rol en localStorage) sin modificar el flujo de datos.
  //         // Guardamos el token y el rol en localStorage
  //         localStorage.setItem('authToken', response.token); 
  //         localStorage.setItem('userRole', response.role);  // Guarda el rol
  //       })
  //     );
  // }

  login(username: string, password: string): Observable<any> {
    const testUsers = [
      { username: 'admin', password: 'Admin123!', role: 'admin' },
      { username: 'usuario', password: 'User123!', role: 'user' }
    ];
  
    const foundUser = testUsers.find(
      user => user.username === username && user.password === password
    );
  
    if (foundUser) {
      const response = {
        token: 'fake-jwt-token',
        role: foundUser.role
      };
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', response.role);
      return of(response);
    } else {
      return throwError(() => new Error('Credenciales incorrectas'));
    }
  }
  

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');  // Verifica si el token está en el localStorage
  }

  // Método para obtener el rol del usuario
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  register(email: string, username: string, password: string) {
    // Implement the registration logic here, e.g., making an HTTP request to the backend
    return {
      subscribe: (callbacks: { next: Function; error: Function }) => {
        // Simulate a successful registration
        setTimeout(() => {
          callbacks.next({ message: 'Registration successful' });
        }, 1000);

        // Uncomment the following line to simulate an error
        // callbacks.error({ message: 'Registration failed' });
      },
    };
  }
}
