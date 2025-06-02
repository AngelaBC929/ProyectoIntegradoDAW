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
          //Guardar el token en el localStorage
          // Redirigir según el rol del usuario

          if (response.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user/dashboard']);
          }
        }
      },
      error: (error: any) => {
        console.error('Error de autenticación', error);
      },
    });
  }
 
  goHome() {
    this.cerrar.emit(); // Emite evento para cerrar modal
  }
  
}
