import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'] ,
  imports: [CommonModule] 
})
export class GalleryComponent {
  photos = [
    { id: 1, url: 'photo1.jpg', title: 'Photo 1' },
    { id: 2, url: 'photo2.jpg', title: 'Photo 2' },
    { id: 3, url: 'photo3.jpg', title: 'Photo 3' },
  ];


  constructor(private router: Router) { }
    // Método para redirigir al usuario al panel de usuario
    goBackToHome(): void {
      this.router.navigate(['home']); 
    }
}
