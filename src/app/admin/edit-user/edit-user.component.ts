import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Para el formulario reactivo
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,  // Necesario para formularios reactivos
    RouterModule  // Necesario para manejar las rutas
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userId!: number;  // Usamos "!" para asegurar que se inicializa antes de usarlo
  userForm!: FormGroup;  // Usamos "!" para asegurar que se inicializa antes de usarlo
  user: User | null = null;  // Usuario a editar

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Aseguramos que el userId esté tomado de la URL
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    // Inicializamos el formulario reactivo
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });

    // Luego, cargamos los datos del usuario con el ID
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;  // Asignamos el usuario
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

  // Método para guardar los cambios
  saveUser(): void {
    if (this.userForm.valid && this.user) {
      const updatedUser: User = {
        ...this.user,
        ...this.userForm.value
      };

      // Validamos que no se intente cambiar el rol del admin principal
      if (this.userId === 14 && updatedUser.role !== this.user?.role) {
        alert('No puedes cambiar el rol del admin principal');
        return;  // Detenemos el proceso si es el admin principal
      }

      // Llamamos al servicio para actualizar el usuario
      this.userService.updateUser(this.userId, updatedUser).subscribe({
        next: () => {
          // Después de la actualización, redirigimos a la vista de control de usuarios
          this.router.navigate(['/admin/user-control']);
        },
        error: (error) => {
          console.error('Error al actualizar el usuario', error);
        }
      });
    }
  }

  // Método para cancelar la edición y volver al listado de usuarios
  cancel(): void {
    this.router.navigate(['/admin/user-control']);  // Redirige al listado de usuarios
  }
}
