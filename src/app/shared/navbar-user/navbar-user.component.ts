import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css'],
})
export class NavbarUserComponent {
  constructor(private router: Router) {}

  // Método de logout
  logout() {
    localStorage.removeItem('authToken');  // Elimina el token de autenticación
    localStorage.removeItem('userRole');   // Elimina el rol
    this.router.navigate(['/home']);      // Redirige a la página de home
  }

}
