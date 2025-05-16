import { Component, OnInit } from '@angular/core';
import { RallyService } from '../../shared/services/rally.service';
import { Router } from '@angular/router';
import { Rally } from '../../shared/models/rally.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-rallies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-rallies.component.html',
  styleUrls: ['./gestion-rallies.component.css']
})
export class GestionRalliesComponent implements OnInit {
  rallies: Rally[] = [];

  constructor(
    public router: Router,
    private rallyService: RallyService
  ) {}

  ngOnInit(): void {
    // Aquí nos suscribimos a 'rallies$' para obtener los datos actualizados automáticamente
    this.rallyService.rallies$.subscribe(rallies => {
      const currentDate = new Date(); // Obtener la fecha actual
      currentDate.setHours(0, 0, 0, 0); // Asegurarse de que solo compare la fecha (sin hora)

      // Filtramos los rallies para mostrar solo los que son futuros o actuales
      this.rallies = rallies.filter(rally => {
        const startDate = new Date(rally.start_date); // Convertimos el start_date en un objeto Date
        startDate.setHours(0, 0, 0, 0); // Ignorar las horas al comparar las fechas

        return startDate >= currentDate; // Comparamos solo la fecha sin horas
      });

      console.log('Rallies actuales y futuros:', this.rallies);
    });

    // Llamamos a getAllRallies para cargar los rallies por primera vez.
    this.rallyService.getAllRallies().subscribe();
  }

  // Redirigir al formulario de edición
  editRally(id: number): void {
    this.router.navigate([`/admin/edit-rallies/${id}`]);
  }

  // Eliminar un rally
  deleteRally(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este rally?')) {
      this.rallyService.deleteRally(id).subscribe(() => {
        alert('Rally eliminado');
        // Aquí no necesitamos recargar la lista manualmente, ya que el BehaviorSubject se actualizará automáticamente
      });
    }
  }
}
