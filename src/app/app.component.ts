import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './shared/services/authentication.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rallyFotografico';
  role: string | null = null;
  showModal: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Escuchar el cambio de rol (para navbar)
    this.authService.role$.subscribe(role => {
      this.role = role;
    });

    // Mostrar el modal de sesión expirada si se detecta
    this.authService.sessionExpired$.subscribe(() => {
      this.showSessionExpiredModal();
    });

    // Comprobar si está autenticado al arrancar
    this.isLoggedIn = this.authService.isAuthenticated();
    if (!this.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

  // Eventos del usuario para resetear timeout de inactividad
  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keydown', ['$event'])
  @HostListener('document:click', ['$event'])
  onUserActivity() {
    this.authService.resetTimeout();
  }

  // Mostrar el modal de sesión expirada
  showSessionExpiredModal() {
    this.showModal = true;
    
  }

  // Si elige iniciar sesión nuevamente tras sesión expirada
handleLogin() {
  this.showModal = false;
  this.authService.logout();
  this.authService.setLoginAfterSessionExpired(true); // ✅ marcamos que venimos de expiración
  this.router.navigate(['/login']);
}


  // Si elige cancelar, cierra sesión y vuelve al inicio
  handleCancel() {
    this.authService.logout();
    this.showModal = false;
    this.router.navigate(['/home']);
  }
}
