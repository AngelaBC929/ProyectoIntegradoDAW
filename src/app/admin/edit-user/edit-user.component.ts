import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  userId!: number;
  userForm!: FormGroup;
  user: User | null = null;

  private readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*]).{8,12}$/;
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router, private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue({
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        });
      },
      error: (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    });
  }

  saveUser(): void {
    if (this.userForm.valid && this.user) {
      const updatedUser: User = {
        ...this.user,
        ...this.userForm.value
      };

      // Validación para no cambiar el rol del admin principal
      if (this.userId === 14 && updatedUser.role !== this.user?.role) {
        this.sweetAlert.warning('No puedes cambiar el rol del admin principal');
        return;
      }

      this.userService.updateUser(this.userId, updatedUser).subscribe({
        next: () => {
          this.router.navigate(['/admin/user-control']);
        },
        error: (error) => {
          console.error('Error al actualizar el usuario', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/user-control']);
  }
  
}
