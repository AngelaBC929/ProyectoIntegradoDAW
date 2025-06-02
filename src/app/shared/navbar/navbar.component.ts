import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';  // Asegúrate de importar el servicio
import { User } from '../models/user.model';  // Importa el modelo de usuario
import { AuthenticationService } from '../services/authentication.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userName: string = 'Invitado';  // Inicializamos con 'Invitado' por defecto
  userId: number = 0;  // El ID del usuario que obtendremos de localStorage

  constructor(private router: Router, private userService: UserService,   private authenticationService: AuthenticationService  ) {}

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
    
    this.authenticationService.setRole(null);  // Notificar a la app que ya no hay usuario logueado
    this.router.navigate(['/home']); // Redirigir donde quieras
  }
  
  
    // 🔄 Opcional: limpiar todos los datos
    // localStorage.clear();
  
    // 🔄 Forzar recarga para que AppComponent vuelva a evaluar el role
    // window.location.href = '/home';
  }
  

