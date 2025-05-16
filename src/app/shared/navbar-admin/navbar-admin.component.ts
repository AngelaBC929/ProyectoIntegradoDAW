import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css'],
})
export class NavbarAdminComponent {
  constructor(private router: Router) {}

  // Método de logout
  logout() {
    localStorage.removeItem('authToken');  // Elimina el token de autenticación
    localStorage.removeItem('userRole');   // Elimina el rol
    this.router.navigate(['/home']);      // Redirige a la página de home
  }
}
