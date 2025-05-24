// src/app/shared/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const role = this.authService.getUserRole();
    const currentUserId = this.authService.getUserId();  // Obtenemos el ID del usuario logueado

    // Verificamos si el usuario es admin y si su ID no es 14 (admin principal)
    if (role === 'admin') {
      return true; // ✅ TODOS los admins, incluido el principal (id 14), pueden acceder
    
    } else {
      // Si no es admin, redirigimos a la zona de usuarios
      this.router.navigate(['/user/dashboard']);
      return false;
    }
  }
}
