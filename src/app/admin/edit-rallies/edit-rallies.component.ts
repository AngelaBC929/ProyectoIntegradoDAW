import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RallyService } from '../../shared/services/rally.service';
import { Rally } from '../../shared/models/rally.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-edit-rallies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-rallies.component.html',
  styleUrls: ['./edit-rallies.component.css']
})
export class EditRalliesComponent implements OnInit {
  rallyForm!: FormGroup;
  rallyId!: number;
  isLoading: boolean = false;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rallyService: RallyService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.rallyId = Number(this.route.snapshot.paramMap.get('id')); 
    console.log('ID desde la URL:', this.rallyId); 
    
    // Formulario con validaciones
    this.rallyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      theme: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    }, {
      validators: this.dateValidator  // Añadimos validador personalizado para fechas
    });
   
    // Cargar datos del rally
    this.rallyService.getRallyById(this.rallyId).subscribe((rally) => {
      console.log('Rally recibido:', rally); 
      if (rally) {
        this.rallyForm.patchValue({
          title: rally.title,
          description: rally.description,
          start_date: this.formatDate(rally.start_date),
          end_date: this.formatDate(rally.end_date),
          location: rally.location,
          theme: rally.theme
        });
      } else {
        this.message = 'No se encontró el rally.';
      }
    });
  }

  // Método para formatear la fecha para los campos de tipo 'date'
  formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');  // Meses de 0-11
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  // Formato 'yyyy-MM-dd'
  }

  // Validador personalizado para las fechas (end_date debe ser posterior a start_date)
  dateValidator(group: FormGroup): { [key: string]: any } | null {
    const start = group.get('start_date')?.value;
    const end = group.get('end_date')?.value;
  
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
  
      // Si la fecha de fin es anterior a la de inicio, asigna el error al grupo
      if (endDate < startDate) {
        return { dateMismatch: true };
      }
    }
  
    return null;
  }
  
  

  // Envío del formulario
  onSubmit(): void {
    if (this.rallyForm.valid) {
      this.isLoading = true;
      const updatedRally: Rally = this.rallyForm.value;
  
      console.log('Formulario enviado:', updatedRally); 
  
      this.rallyService.updateRally(this.rallyId, updatedRally).subscribe(
        (response) => {
          this.isLoading = false;
          this.message = 'Rally actualizado correctamente.';
          this.router.navigate(['/admin/gestion-rallies']); 
        },
        (error) => {
          this.isLoading = false;
          this.message = 'Error al actualizar el rally.';
          console.error('Error al actualizar el rally:', error); 
        }
      );
    } else {
      this.message = 'Por favor, completa todos los campos correctamente.';
    }
  }
  


  cancel(): void {
    this.router.navigate(['/admin/gestion-rallies']);
  }
}
