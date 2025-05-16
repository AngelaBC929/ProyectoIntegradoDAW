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
  imports: [CommonModule, ReactiveFormsModule, DateFormatPipe],
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
    this.rallyId = Number(this.route.snapshot.paramMap.get('id')); // Verifica que este ID es correcto
    console.log('ID desde la URL:', this.rallyId); // Esto debe mostrar el ID correcto
  
    this.rallyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      location: ['', Validators.required],
      theme: ['', Validators.required]
    });
  
    this.rallyService.getRallyById(this.rallyId).subscribe((rally) => {
      console.log('Rally recibido:', rally); // Verifica qué rally se está devolviendo
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

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.rallyForm.valid) {
      this.isLoading = true;
      const updatedRally: Rally = this.rallyForm.value;

      this.rallyService.updateRally(this.rallyId, updatedRally).subscribe(
        (response) => {
          this.isLoading = false;
          this.message = 'Rally actualizado correctamente.';
          this.router.navigate(['/admin/gestion-rallies']); // Redirige a la gestión
        },
        (error) => {
          this.isLoading = false;
          this.message = 'Error al actualizar el rally.';
        }
      );
    } else {
      this.message = 'Por favor, completa todos los campos correctamente.';
    }
  }
}
