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
  showModal: boolean = false;  // Variable para mostrar el modal
  isLoggedIn: boolean = false;  // Estado de autenticación




  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit() {
    // Escuchar cambios en el rol de usuario
    this.authService.role$.subscribe(role => {
      this.role = role;
    });
  
    // ✅ Escuchar el evento de sesión expirada
    this.authService.sessionExpired$.subscribe(() => {
      this.showSessionExpiredModal();
    });
  
    // Verificar si ya está autenticado (por ejemplo, al recargar)
    //lo comento xq si no pasa directamenta al popup en vez de al home
    // if (!this.authService.isAuthenticated()) {
    //   this.showSessionExpiredModal();
    // }
    // Verificar si el usuario está autenticado
    this.isLoggedIn = this.authService.isAuthenticated();

    // Si no está autenticado, redirigir al home (evitar mostrar el modal si ya no está autenticado)
    if (!this.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }
  
  

  // Captura los eventos de interacción del usuario (movimiento del ratón, pulsación de teclas, clics)
  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keydown', ['$event'])
  @HostListener('document:click', ['$event'])
  onUserActivity() {
    this.authService.resetTimeout(); // Reinicia el temporizador de inactividad
  }

  // Método para mostrar el modal de sesión expirada
  showSessionExpiredModal() {
    this.showModal = true;  // Muestra el modal
  }

  // Maneja la acción de logueo, cierra la sesión y redirige al login
  handleLogout() {
    this.authService.logout();  // Llama al método de logout
    this.router.navigate(['/login']);  // Redirige al formulario de login
    this.showModal = false;  // Cierra el modal
  }
  handleCancel() {
    this.authService.logout(); // ✅ Cierra la sesión completamente
    this.showModal = false;    // Oculta el modal
    this.router.navigate(['/home']); // Redirige al Home
  }
  
}
