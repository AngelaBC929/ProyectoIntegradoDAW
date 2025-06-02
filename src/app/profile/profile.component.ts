import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  photos = [
    { id: 1, url: 'profile-photo1.jpg', title: 'Profile Photo 1', status: 'Active' },
    { id: 2, url: 'profile-photo2.jpg', title: 'Profile Photo 2', status: 'Inactive' }
  ];
}
