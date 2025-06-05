import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None
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
  acceptTerms: boolean = false;
  formSubmitted: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  isSubmitting: boolean = false;

  // Expresión regular para validar la contraseña
  // Debe tener entre 8 y 12 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
  private readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*]).{8,12}$/;

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

  onBirthdateChange() {
    const birthdate = new Date(this.birthdate);
    const today = new Date();
    this.userAge = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      this.userAge--;
    }

    // Validación de edad mínima
    if (this.userAge < 18) {
      this.errorMessages.push('Debes tener al menos 18 años para registrarte.');
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  get isFormValid() {
    return (
      this.password === this.confirmPassword &&
      this.password.length >= 8 &&
      this.username.length >= 3 &&
      this.name.length >= 2 &&
      this.lastName.length >= 2 &&
      this.userAge >= 18 &&
      this.acceptTerms
    );
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  onSubmit(registerForm: NgForm) {
    this.isSubmitting = true;
    this.formSubmitted = true;
    this.errorMessages = [];
    this.backendFieldErrors = {};

    if (!registerForm.valid || !this.acceptTerms) {
      this.isSubmitting = false;
      return;
    }

    this.validatePasswords();
    if (this.errorMessages.length > 0) {
      this.isSubmitting = false;
      return;
    }

    this.authenticationService.register(
      this.email, this.username, this.password, this.name, this.lastName, this.birthdate
    ).subscribe(
      (response: any) => {
        this.isSubmitting = false;
        console.log('Respuesta del backend:', response);


        if (typeof response?.error === 'string') {
          if (response.error.includes('correo')) {
            this.backendFieldErrors['email'] = response.error;
          } else if (response.error.includes('usuario')) {
            this.backendFieldErrors['username'] = response.error;
          } else {
            this.errorMessages.push(response.error);
          }
          return;
        }

        if (response.message === 'Usuario creado correctamente') {
          this.router.navigate(['/'], {
            state: { message: 'Usuario registrado con éxito. Puedes iniciar sesión cuando quieras.' }
          });
        }
      },
      (error) => {
        this.isSubmitting = false;
        this.errorMessages.push('Ocurrió un error al registrar el usuario. Inténtalo más tarde.');
        console.error(error);
      }
    );
  }
}
