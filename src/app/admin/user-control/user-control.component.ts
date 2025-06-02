import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model'; // Asegúrate de importar correctamente el modelo User
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-user-control',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.css']
})
export class UserControlComponent implements OnInit {
  users: User[] = [];  // Lista de usuarios, usando el modelo User
  loading: boolean = true;  // Indicador de carga

  constructor(private userService: UserService, private router: Router, private sweetAlert: SweetAlertService) {}

  ngOnInit(): void {
    // Obtener los usuarios al cargar el componente
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Usuarios recibidos:', users);
        this.users = users;  // Asignamos los usuarios a la lista
        this.loading = false;  // Dejamos de mostrar el loading
      },
      error: (error) => {
        console.error('Error al obtener los usuarios', error);
        this.loading = false;  // Dejamos de mostrar el loading en caso de error
      }
    });
  }




  // Eliminar usuario
deleteUser(userId: number): void {
  this.userService.getUserById(userId).subscribe(user => {
    if (user) {
      const userName = `${user.name} ${user.lastName}`;
      this.sweetAlert.confirm(
        `¿Estás seguro de que quieres eliminar al usuario: ${userName}?`,
        'Esta acción no se puede deshacer.'
      ).then(isConfirmed => {
        if (isConfirmed) {
          this.userService.deleteUser(userId).subscribe(() => {
            this.sweetAlert.success('Usuario eliminado correctamente');
            // Actualizamos la lista de usuarios después de la eliminación
            this.users = this.users.filter(u => u.id !== userId);
          });
        }
      });
    } else {
      console.error('Usuario no encontrado');
    }
  });
}


  // Editar usuario
  
editUser(userId: number): void {
  this.router.navigate(['/admin/edit-user', userId]);  // Redirige a la página de edición de usuario
}
// Método para redirigir al usuario al panel de usuario
goBackToAdminPanel(): void {
  this.router.navigate(['admin']); 
}
}
