import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  name: string = '';
  lastName: string = '';
  birthdate: string = '';
  errorMessages: string[] = [];
  userAge: number = 0;
  backendFieldErrors: { [key: string]: string } = {};


  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  isSubmitting: boolean = false;

  private readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*]).{8,12}$/;
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  validatePasswords() {
    this.errorMessages = [];

    if (this.password !== this.confirmPassword) {
      this.errorMessages.push('Las contraseñas no coinciden.');
    }

    if (!this.passwordRegex.test(this.password)) {
      this.errorMessages.push('La contraseña debe tener entre 8 y 12 caracteres, incluir mayúsculas, minúsculas, un número y uno de los siguientes caracteres especiales: !@#$%^&*.');
    }
  }

  onSubmit(registerForm: NgForm) {
    this.isSubmitting = true;
  
    this.authenticationService.register(
      this.email, this.username, this.password, this.name, this.lastName, this.birthdate
    ).subscribe(
      (response: any) => {
        this.isSubmitting = false;
        console.log('Respuesta del backend:', response);
  
        if (response.error) {
          this.backendFieldErrors = {}; // Resetear errores previos
          
          if (response.error.includes('correo')) {
            this.backendFieldErrors['email'] = response.error;
          } else if (response.error.includes('usuario')) {
            this.backendFieldErrors['username'] = response.error;
          } else {
            this.errorMessages.push(response.error); // Error genérico
          }
          
          return;
        }
  
        // ✅ Si se creó correctamente
        if (response.message === 'Usuario creado correctamente') {
          // Redirigir al home con el mensaje de éxito
          this.router.navigate(['/'], { state: { message: 'Usuario registrado con éxito. Puedes iniciar sesión cuando quieras.' } });
        }
      },
      (error: any) => {
        this.isSubmitting = false;
        const backendError = error?.error?.error || 'Hubo un error al registrar el usuario.';
        this.errorMessages.push(backendError);
      }
    );
  }
  

  // Método para calcular la edad del usuario basándose en la fecha de nacimiento
  onBirthdateChange() {
    const birthdate = new Date(this.birthdate);
    const today = new Date();
    this.userAge = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      this.userAge--;
    }

    // Validación de la edad
    if (this.userAge < 18) {
      this.errorMessages.push('Debes tener al menos 18 años para registrarte.');
    }
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Método para alternar la visibilidad de la confirmación de la contraseña
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // Método para verificar si el formulario es válido
  get isFormValid() {
    return (
      this.password === this.confirmPassword &&
      this.password.length >= 8 &&
      this.username.length >= 3 &&
      this.name.length >= 2 &&
      this.lastName.length >= 2 &&
      this.userAge >= 18
    );
  }
  

  // Método para cancelar el registro y redirigir al home
  cancel(): void {
    this.router.navigate(['/home']);
  }
}
