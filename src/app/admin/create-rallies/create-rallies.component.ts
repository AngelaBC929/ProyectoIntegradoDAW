import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RallyService } from '../../shared/services/rally.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-rallies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-rallies.component.html',
  styleUrls: ['./create-rallies.component.css']
})
export class CreateRalliesComponent {
  rallyForm: FormGroup;
  isLoading = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private rallyService: RallyService,
    private router: Router
  ) {
    this.rallyForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      location: ['', Validators.required],
      theme: ['', Validators.required]
    });
  }

  // Método para crear un rally
onSubmit(): void {
  console.log("El formulario ha sido enviado");

  if (this.rallyForm.valid) {
    this.isLoading = true;
    console.log('Formulario válido, creando rally...');
    
    this.rallyService.createRally(this.rallyForm.value).subscribe(
      (response: any) => {
        console.log('Rally creado con éxito:', response);
        this.isLoading = false;
        this.message = 'Rally creado exitosamente!';
        
        // Redirigir a la gestión de rallies después de la creación
        this.router.navigate(['/admin/gestion-rallies']).then(() => {
          console.log('Redirigiendo a /admin/gestion-rallies');
        });
      },
      (error: any) => {
        console.error('Error al crear el rally:', error);
        this.isLoading = false;
        this.message = 'Error al crear el rally. Inténtalo nuevamente.';
      }
    );
  } else {
    this.message = 'Por favor, completa todos los campos correctamente.';
  }
}

}
