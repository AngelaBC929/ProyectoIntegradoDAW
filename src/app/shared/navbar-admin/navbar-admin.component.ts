import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';  // Asegúrate de importar el servicio
import { User } from '../../shared/models/user.model';  // Importa el modelo de usuario

@Component({
  selector: 'navbar-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css'],
})
export class NavbarAdminComponent implements OnInit {
  userName: string = 'Invitado';  // Inicializamos con 'Invitado' por defecto
  userId: number = 0;  // El ID del usuario que obtendremos de localStorage

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    // Obtener el ID del usuario desde localStorage
    this.userId = +localStorage.getItem('userId')!; // Asegúrate de que 'userId' esté guardado en localStorage

    if (this.userId) {
      // Obtener los datos del usuario desde la API
      this.userService.getUserById(this.userId).subscribe((user: User) => {
        // Asignar el nombre del usuario a la variable userName
        this.userName = user.name;  // Asegúrate de que el modelo User tenga el campo 'name'
        console.log('Nombre del usuario:', this.userName);
      });
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  
    // 🔄 Opcional: limpiar todos los datos
    // localStorage.clear();
  
    // 🔄 Forzar recarga para que AppComponent vuelva a evaluar el role
    // window.location.href = '/home';
  }
  
}
