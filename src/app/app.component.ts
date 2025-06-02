import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarUserComponent } from './shared/navbar-user/navbar-user.component';
import { NavbarAdminComponent } from './shared/navbar-admin/navbar-admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarUserComponent, NavbarAdminComponent, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rallyFotografico';
  role: string | null = null;
  currentUser: any;
  router: any;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    // Escuchar cambios en el rol de usuario
    this.authService.role$.subscribe(role => {
      this.role = role;
      console.log('Rol actualizado desde AppComponent:', role);
    });
  }
  // ngOnInit() {
  //   const user = localStorage.getItem('user');
  //   if (user) {
  //     this.currentUser = JSON.parse(user);
  //   } else {
  //     this.router.navigate(['/login']);
  //   }
  // }
}
