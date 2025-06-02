import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/usuarios.php`;

  constructor(private http: HttpClient) {}

  // Obtener un usuario por su ID desde la API
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}?id=${userId}`);
  }

  // Obtener todos los usuarios desde la API
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Actualizar un usuario en la API
updateUser(userId: number, userData: User): Observable<any> {
  const payload = {
    ...userData,
    id: userId,
    action: 'update'
  };
  return this.http.post<any>(this.apiUrl, payload);
}

  // Eliminar un usuario desde la API
 deleteUser(userId: number): Observable<any> {
  const payload = {
    id: userId,
    action: 'delete'
  };
  return this.http.post<any>(this.apiUrl, payload);
}

// Aprobar o rechazar una foto
updatePhotoStatus(photoId: number, status: string): Observable<any> {
  const payload = {
    action: 'approve_or_reject',
    photo_id: photoId,
    status: status
  };
  return this.http.post<any>(`${environment.apiUrl}/fotos.php`, payload);
}

}
