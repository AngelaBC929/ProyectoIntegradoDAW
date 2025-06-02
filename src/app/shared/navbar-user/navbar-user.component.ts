import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';  // Necesario para gestionar la suscripción
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navbar-user',
  standalone: true,
  imports: [CommonModule],  // Aquí puedes importar otros módulos si es necesario
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css']
})
export class NavbarUserComponent implements OnInit {
  userName: string = 'Invitado';  // Inicializamos con 'Invitado' por defecto
  userId: number = 0;  // El ID del usuario que obtendremos de localStorage
  userRole: string | null = null;  // Almacenar el rol
  private roleSubscription!: Subscription;

  constructor(
    private router: Router, 
    private userService: UserService, 
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // Suscribir al observable role$ para obtener el rol actual
    this.roleSubscription = this.authenticationService.role$.subscribe(role => {
      this.userRole = role;
    });

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

  ngOnDestroy(): void {
    // Cancelar la suscripción al observable cuando el componente se destruya
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    this.authenticationService.setRole(null);  // Notificar a la app que ya no hay usuario logueado
    this.router.navigate(['/home']); // Redirigir donde quieras
  }
}
