import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component'; // Ajusta la ruta si es diferente
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  showLoginModal: boolean = false;
  successMessage: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}
  isLoginVisible = false;
  
  ngOnInit(): void {
    // Verifica si hay un mensaje en el state de la ruta
    const navigation = history.state;
    if (navigation?.message) {
      this.successMessage = navigation.message;
    }
  }

  closeSuccessMessage(): void {
    this.successMessage = null;
  }
  mostrarLogin() {
    this.isLoginVisible = true;
  }

  cerrarLogin() {
    this.isLoginVisible = false;
  } 

  // Navegar a galería
  goToGallery() {
    this.router.navigate(['/gallery']);
  }

  // Navegar a registro
  goToRegister() {
    this.router.navigate(['/register']);
  } // Método de logout
  
}
