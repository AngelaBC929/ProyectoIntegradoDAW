import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarUserComponent } from './shared/navbar-user/navbar-user.component'; // Importar NavbarUser
import { NavbarAdminComponent } from './shared/navbar-admin/navbar-admin.component'; // Importar NavbarAdmin
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarUserComponent, NavbarAdminComponent, CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rallyFotografico';
  role: string | null = null;

  ngOnInit() {
    this.role = localStorage.getItem('userRole');
    console.log('Rol obtenido del localStorage:', this.role);
  }
}
