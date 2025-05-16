import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @Output() closeModal = new EventEmitter<void>();

  username: string = '';
  password: string = '';
  submitted: boolean = false;
  passwordVisible: boolean = false;  // Variable para mostrar u ocultar la contraseña

  // Expresión regular para validar la contraseña
  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,12}$/;

  // Controlar la visibilidad del modal y overlay
  showModal: boolean = false; // Controla si el modal está visible
  

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  // Método para validar la contraseña
  passwordValid(): boolean {
    return this.passwordRegex.test(this.password);
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Método para mostrar el modal y overlay
  openModal() {
    this.showModal = true;
    
  }


  // Método para manejar el submit del formulario
  onSubmit() {
    this.submitted = true;

    if (!this.passwordValid()) {
      return; // Si la contraseña no es válida, no enviamos el formulario
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', response.role);
        this.closeModalMethod(); // Cerrar el modal al hacer login

        if (response.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']); // Ajusta esta ruta según corresponda
        }
      },
      error: (error) => {
        console.error('Error de autenticación', error);
      },
    });
  }

  closeModalMethod() {
    this.showModal = false;
    this.router.navigate(['/']); // Redirige al home
  }
}
