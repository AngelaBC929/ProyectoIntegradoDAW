import { CommonModule } from '@angular/common'; 
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userName: string = 'Invitado';
  private subscription!: Subscription;

  constructor(
    private router: Router, 
    private userService: UserService,   
    private authenticationService: AuthenticationService  
  ) {}

  ngOnInit(): void {
    // Suscribimos al BehaviorSubject para actualizar el nombre en vivo
    this.subscription = this.authenticationService.username$.subscribe(name => {
      this.userName = name || 'Invitado';
    });

    // Si no hay nombre en el BehaviorSubject, intentamos cargarlo (solo la primera vez)
    if (!this.authenticationService.getUsername()) {
      const userId = +localStorage.getItem('userId')!;
      if (userId) {
        this.userService.getUserById(userId).subscribe((user: User) => {
          this.authenticationService.setUsername(user.name);
          localStorage.setItem('user_name', user.name);
        });
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('user_name');
    this.authenticationService.setRole(null);
    this.authenticationService.setUsername(null);
    this.router.navigate(['/home']);
  }
}
