import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  dateRangeError: string | null = null;
  titleDuplicationError: string | null = null;
  rallies: any[] = [];  // Aquí almacenaremos los rallies

  constructor(
    private formBuilder: FormBuilder,
    private rallyService: RallyService,
    private router: Router
  ) {
    this.rallyForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      location: ['', Validators.required],
      theme: ['', Validators.required]
    });
  }

  // Método para crear el rally
  onSubmit(): void {
    this.dateRangeError = null;
    this.titleDuplicationError = null;
  
    if (this.rallyForm.valid) {
      const startDate = new Date(this.rallyForm.value.start_date);
      const endDate = new Date(this.rallyForm.value.end_date);
  
      if (endDate < startDate) {
        this.dateRangeError = 'La fecha de finalización no puede ser anterior a la de inicio.';
        return;
      }
  
      const rallyData = {
        ...this.rallyForm.value,
        created_by: parseInt(localStorage.getItem('userId') || '0', 10)
      };
  
      this.isLoading = true;
      this.rallyService.createRally(rallyData).subscribe(
        (response: any) => {
          if (response?.error && response.error === "Ya existe un rally con ese título y fecha de inicio") {
            this.titleDuplicationError = response.error;
            this.isLoading = false;
            return;
          }
  
          this.message = 'Rally creado exitosamente!';
          this.isLoading = false;
  
          this.rallyService.getAllRallies().subscribe((rallies) => {
            this.rallies = rallies;  // Asegúrate que `this.rallies` exista o lo necesites aquí
          });
  
          this.router.navigate(['/admin/gestion-rallies']);
        },
        (error: any) => {
          this.isLoading = false;
          this.message = error?.error?.error || 'Error al crear el rally. Inténtalo nuevamente.';
        }
      );
    }
  }
  fields = [
  {
    id: 'title',
    name: 'title',
    label: 'Título',
    type: 'text',
    errors: [
      { type: 'required', message: 'El título es obligatorio.' },
      { type: 'minlength', message: 'Debe tener al menos 6 caracteres.' }
    ]
  },
  {
    id: 'description',
    name: 'description',
    label: 'Descripción',
    type: 'textarea',
    errors: [
      { type: 'required', message: 'La descripción es obligatoria.' },
      { type: 'minlength', message: 'Debe tener al menos 10 caracteres.' },
      { type: 'maxlength', message: 'No puede tener más de 250 caracteres.' }
    ]
  },
  {
    id: 'start_date',
    name: 'start_date',
    label: 'Fecha de inicio',
    type: 'date',
    errors: [
      { type: 'required', message: 'La fecha de inicio es obligatoria.' }
    ]
  },
  {
    id: 'end_date',
    name: 'end_date',
    label: 'Fecha de finalización',
    type: 'date',
    errors: [
      { type: 'required', message: 'La fecha de finalización es obligatoria.' }
    ]
  },
  {
    id: 'location',
    name: 'location',
    label: 'Ubicación',
    type: 'text',
    errors: [
      { type: 'required', message: 'La ubicación es obligatoria.' }
    ]
  },
  {
    id: 'theme',
    name: 'theme',
    label: 'Tema',
    type: 'text',
    errors: [
      { type: 'required', message: 'El tema es obligatorio.' }
    ]
  }
];
getIconClassByTheme(tema: string = ''): string {
  switch (tema) {
    case 'fotografia': return 'fa-solid fa-camera-retro';
    case 'naturaleza': return 'fa-solid fa-tree';
    case 'deporte': return 'fa-solid fa-person-hiking';
    case 'animales': return 'fa-solid fa-paw';
    case 'comida': return 'fa-solid fa-utensils';
    case 'mar y playa': return 'fa-solid fa-umbrella-beach';
    case 'paisaje urbano': return 'fa-solid fa-city';
    default: return 'fa-solid fa-question';
  }
}


cancelCreation() {
  this.router.navigate(['admin/gestion-rallies']); // o la ruta que corresponda a tu panel de admin
}

  
}
