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

  // Propiedades para controlar la visibilidad de las contraseñas
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;


  constructor(private router: Router, private authenticationService: AuthenticationService  ) {}

  // Método de validación de contraseñas
  validatePasswords() {
    this.errorMessages = [];  // Limpiar mensajes de error antes de cada validación

    // Validar las contraseñas coincidentes
    if (this.password !== this.confirmPassword) {
      this.errorMessages.push('Las contraseñas no coinciden.');
    }

    // Validar formato de la contraseña (mayúsculas, minúsculas, número, carácter especial)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*]).{8,12}$/;
    if (!passwordRegex.test(this.password)) {
      this.errorMessages.push('La contraseña debe tener entre 8 y 12 caracteres, incluir mayúsculas, minúsculas, un número y uno de los siguientes caracteres especiales: !@#$%^&*.');
    }
  }

  onSubmit(form: NgForm) {
    console.log("🚀 onSubmit() ejecutado");
    this.errorMessages = []; // Limpiar errores antes de cada validación
    this.onBirthdateChange(); // Actualizar edad antes de verificar
  
    // Validar campos
    this.validatePasswords();  // Validar contraseñas
  
    // Validar edad mínima
    if (this.userAge < 18) {
      this.errorMessages.push('Debes tener al menos 18 años para registrarte.');
    }
  
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessages.push('El correo electrónico no es válido.');
    }
  
    // Validar otros campos
    if (!this.username || this.username.length < 3) {
      this.errorMessages.push('El nombre de usuario debe tener al menos 3 caracteres.');
    }
  
    if (!this.name || this.name.length < 2) {
      this.errorMessages.push('El nombre debe tener al menos 2 caracteres.');
    }
  
    if (!this.lastName || this.lastName.length < 2) {
      this.errorMessages.push('El apellido debe tener al menos 2 caracteres.');
    }
  
    // Si hay errores, no continuar
    if (form.invalid || this.errorMessages.length > 0) {
      console.log("❌ Formulario inválido. No se redirige.");
      console.log("Formulario inválido:", form.invalid);
      console.log("Errores encontrados:", this.errorMessages);
      return;
    }
      
    // Si todo es válido
    console.log('Formulario válido:', form.value);
  
    // Enviar los datos del formulario al backend
    this.authenticationService.register(this.email, this.username, this.password, this.name, this.lastName, this.birthdate).subscribe(
      (      response: { message: string; }) => {
        console.log('Respuesta del backend:', response);
        if (response.message === 'Usuario creado correctamente') {
          // Redirigir al login después de un registro exitoso
          this.router.navigate(['/login']).then(success => {
            console.log("Resultado navegación:", success);
          });
        }
      },
      (      error: any) => {
        console.error('Error de registro:', error);
        this.errorMessages.push('Hubo un error al registrar el usuario.');
      }
    );
  }
  
  // Método para calcular la edad del usuario
  onBirthdateChange() {
    const birthdate = new Date(this.birthdate);
    const today = new Date();
    this.userAge = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      this.userAge--;
    }
  }

  // Método para alternar visibilidad de la contraseña
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Método para alternar visibilidad de la confirmación de la contraseña
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // Método para validar el estado del formulario
  get isFormValid() {
    return (
      this.password === this.confirmPassword &&
      this.password.length >= 8 &&
      this.username.length >= 3 &&
      this.name.length >= 2 &&
      this.lastName.length >= 2 &&
      this.userAge >= 18
      // Quitamos el check de errorMessages aquí
    );
  }
   // Método para cancelar la edición y volver al listado de usuarios
   cancel(): void {
    this.router.navigate(['/home']);  // Redirige al listado de usuarios
  }
}
