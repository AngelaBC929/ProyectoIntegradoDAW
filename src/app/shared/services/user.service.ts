// Removed duplicate import of Injectable
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

  export class UserService {
    // Datos simulados de usuarios
    private users: User[] = [
      { id: 1, email: 'admin@example.com', name: 'Admin', lastName: 'Uno', role: 'admin' },
      { id: 2, email: 'user@example.com', name: 'User', lastName: 'Dos', role: 'user' },
      { id: 3, email: 'user2@example.com', name: 'User2', lastName: 'Tres', role: 'user' },
      { id: 4, email: 'admin2@example.com', name: 'Admin2', lastName: 'Cuatro', role: 'admin' },
      { id: 5, email: 'user3@example.com', name: 'User3', lastName: 'Cinco', role: 'user' }
    ];
    
  
    constructor() { }
  
    // Simulando el método para obtener un usuario por ID
    getUserById(userId: number): Observable<User> {
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return of(user);  // `of()` devuelve un Observable con el usuario encontrado
    }
  
    // Simulando el método para obtener todos los usuarios
    getAllUsers(): Observable<User[]> {
      return of(this.users);  // `of()` devuelve un Observable con todos los usuarios
    }
  
    // Simulando el método para actualizar un usuario
    updateUser(userId: number, userData: User): Observable<User> {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], ...userData };  // Actualiza los datos del usuario
        return of(this.users[userIndex]);  // Devuelve el usuario actualizado
      }
      throw new Error('Usuario no encontrado');
    }
  
    // Simulando el método para eliminar un usuario
    deleteUser(userId: number): Observable<void> {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        this.users.splice(userIndex, 1);  // Elimina el usuario de la lista
        return of();  // Devuelve un Observable vacío, indicando que la eliminación fue exitosa
      }
      throw new Error('Usuario no encontrado');
    }
  }
  

  //ESTO ES LO QUE TENIA ANTES DE HACER EL MOCK MIENTRAS NO HAYA BACKEND
  // private apiUrl = `${environment.apiUrl}/users`; // URL de tu API

  // constructor(private http: HttpClient) { }

  // getUserById(userId: number): Observable<User> {
  //   return this.http.get<User>(`${this.apiUrl}/${userId}`);
  // }

  // getAllUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(this.apiUrl);
  // }

  // updateUser(userId: number, userData: User): Observable<User> {
  //   return this.http.put<User>(`${this.apiUrl}/${userId}`, userData);
  // }

  // deleteUser(userId: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  // }

