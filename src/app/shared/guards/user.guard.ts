import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const role = this.authService.getRole();  // Obtenemos el rol del usuario

    // Si el usuario es admin, no puede acceder a rutas de usuario
    if (role === 'admin') {
      this.router.navigate(['/admin']);  // Redirigir al panel de admin
      return false;
    }

    return true;  // accede
  }
}
