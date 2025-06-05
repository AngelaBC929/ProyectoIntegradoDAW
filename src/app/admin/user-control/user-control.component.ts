import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
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
  users: User[] = [];  
  loading: boolean = true;  

  constructor(private userService: UserService, private router: Router, private sweetAlert: SweetAlertService) {}

  ngOnInit(): void {

    // Obtener los usuarios al cargar el componente
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Usuarios recibidos:', users);
        this.users = users; 
        this.loading = false;  
      },
      error: (error) => {
        console.error('Error al obtener los usuarios', error);
        this.loading = false; 
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
  this.router.navigate(['/admin/edit-user', userId]); 
}

goBackToAdminPanel(): void {
  this.router.navigate(['admin']); 
}
}
