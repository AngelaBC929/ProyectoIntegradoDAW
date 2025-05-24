import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';

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
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const navigation = history.state;
    if (navigation?.message) {
      this.successMessage = navigation.message;
    }

    this.loadRecentPhotos();
  }

  loadRecentPhotos(): void {
    
    this.http.get('http://localhost/backendRallyFotografico/fotos.php?action=getApprovedPhotos&limit=6&offset=0')
  .subscribe(
    (response: any) => {
      this.recentPhotos = response.photos?.slice(0, 4) || [];
    },
    (error) => {
      console.error('Error al cargar las fotos recientes', error);
    }
  );

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
