import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';
import { PhotoService } from '../shared/services/photo.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    LoginComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showLoginModal: boolean = false;
  successMessage: string | null = null;
  isLoginVisible = false;

  recentPhotos: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    const navigation = history.state;
    if (navigation?.message) {
      this.successMessage = navigation.message;
    }

    this.loadRecentPhotos();
  }

  // Método para cargar las fotos recientes
loadRecentPhotos(): void {
  this.photoService.getFotosAprobadasPaginated(1, 6).subscribe({
    next: (response) => {
      const fotos = response.photos || [];
  
      fotos.forEach((photo: { photo_url: string; }) => {
        photo.photo_url = `${environment.apiUrl}/${photo.photo_url}`;
      });
      this.recentPhotos = fotos.slice(0, 4);
    },
    error: (err) => {
      console.error('Error al cargar las fotos recientes', err);
    }
  });
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

  goToGallery() {
    this.router.navigate(['/gallery']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
