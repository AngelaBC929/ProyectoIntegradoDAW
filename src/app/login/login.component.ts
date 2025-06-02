import { Component, EventEmitter, Output } from "@angular/core";
import { AuthenticationService } from "../shared/services/authentication.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() cerrar = new EventEmitter<void>();
  username: string = '';
  password: string = '';
  submitted: boolean = false;
  passwordVisible: boolean = false;
  errorMessage: string = ''; // Mensaje de error para mostrar en la interfaz

  // Expresión regular para validar la contraseña
  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,12}$/;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  // Método para validar la contraseña
  passwordValid(): boolean {
    return this.passwordRegex.test(this.password);
  }

  // Método para mostrar/ocultar la contraseña
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Método para validar el formulario
  onSubmit() {
    this.submitted = true;

    // Si la contraseña no es válida, no enviamos el formulario
    if (!this.passwordValid()) {
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response: { token: string; role: string; username: string; id: { toString: () => string; }; }) => {
        if (response.token && response.role && response.username && response.id) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('username', response.username);
          localStorage.setItem('userId', response.id.toString());

          // Redirigir según el rol del usuario
          if (response.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user/dashboard']);
          }

          // Cerrar el modal tras redirección
          this.cerrar.emit();
        }
      },
      error: (error) => {
        console.log('Error de login:', error); // Verifica el error recibido en la consola
        
        // Aquí debes asegurarte de que el mensaje que recibes se asigna a 'errorMessage'
        if (error.status === 404) {
          this.errorMessage = error.error.error || 'Este usuario no está registrado. ¿Deseas registrarte?';  // Mensaje personalizado si no está registrado
        } else if (error.status === 401) {
          this.errorMessage = error.error.error || 'Contraseña incorrecta. Intenta de nuevo.';  // Mensaje si las credenciales son incorrectas
        } else {
          this.errorMessage = 'Hubo un problema al intentar iniciar sesión. Por favor, intenta de nuevo más tarde.'; // Mensaje genérico en caso de otro tipo de error
        }
      }
      
      
    });
  }

  // Método para volver al home
  goHome() {
    this.cerrar.emit(); // Emite evento para cerrar modal
  }
}
