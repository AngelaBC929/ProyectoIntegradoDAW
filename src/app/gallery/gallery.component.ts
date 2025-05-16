import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
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

  constructor() { }
}
