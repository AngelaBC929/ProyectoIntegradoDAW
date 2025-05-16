import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'navbar-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css'],
})
export class NavbarUserComponent implements OnInit {
  userName: string = 'Invitado';  // Inicializamos con 'Invitado' por defecto
  userId: number = 0;  // El ID del usuario que obtendremos de localStorage

  constructor(private router: Router, private userService: UserService) {
    console.log('NavbarUserComponent instanciado');
  }
  
  ngOnInit(): void {
    this.userId = +localStorage.getItem('userId')!;
    console.log('userId desde localStorage:', this.userId);  // ✅ DEBUG
  
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user: User) => {
          console.log('Usuario recibido:', user);  // ✅ DEBUG
          this.userName = user.name;
        },
        error: (err) => {
          console.error('Error al obtener usuario:', err);  // ❌ Posible fallo API
        }
      });
    } else {
      console.warn('No se encontró userId en localStorage');
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
