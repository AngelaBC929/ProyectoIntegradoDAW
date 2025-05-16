import { Component, OnInit } from '@angular/core';
import { RallyService } from '../../shared/services/rally.service';
import { Rally } from '../../shared/models/rally.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rallies-actuales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rallies-actuales.component.html',
  styleUrls: ['./rallies-actuales.component.css']
})
export class RalliesActualesComponent implements OnInit {
  ralliesActuales: Rally[] = [];
  userInscribedRallies: number[] = [];

  constructor(private rallyService: RallyService) {}

  ngOnInit(): void {
    this.rallyService.getAllRallies().subscribe((rallies) => {
      const currentDate = new Date(); // Obtener la fecha actual
      currentDate.setHours(0, 0, 0, 0); // Asegurarse de que solo compare la fecha (sin hora)

      // Filtrar rallies que están actualmente en curso
      this.ralliesActuales = rallies.filter(rally => {
        const startDate = new Date(rally.start_date); // Convertimos el start_date en un objeto Date
        const endDate = new Date(rally.end_date); // Convertimos el end_date en un objeto Date
        
        // Establecer las horas en 00:00:00 para comparar solo las fechas
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999); // Consideramos hasta el final del día en end_date

        // Los rallies deben haber comenzado y no deben haber terminado
        return startDate <= currentDate && endDate >= currentDate;
      });

      // Obtenemos las inscripciones del usuario
      this.userInscribedRallies = this.rallyService.getInscripciones();
    });
  }

  // Comprobar si el usuario está inscrito en el rally
  isUserInscribed(rallyId: number): boolean {
    return this.userInscribedRallies.includes(rallyId);
  }

  // Método para inscribirse a un rally
  apuntarse(rallyId: number) {
    this.rallyService.apuntarseARally(rallyId).subscribe((response) => {
      if (response.success) {
        this.userInscribedRallies.push(rallyId);  // Agregamos el rally a las inscripciones del usuario
      }
    });
  }
}
