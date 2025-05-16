import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(private router: Router) {}

  goToRalliesManagement() {
    this.router.navigate(['/admin/gestion-rallies']);
  }

  goToUsersManagement() {
    this.router.navigate(['/admin/user-control']);
  }
}
