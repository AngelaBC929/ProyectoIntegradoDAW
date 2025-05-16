import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
export class HomeComponent {
  showLoginModal: boolean = false;

  constructor(private router: Router) {}

  openLoginModal() {
    console.log('openLoginModal called');
    this.showLoginModal = true;
  }
  
  closeLoginModal() {
    console.log('closeLoginModal called');
    this.showLoginModal = false;
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
