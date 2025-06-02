import { Component, OnInit } from '@angular/core';

import { Rally } from '../../shared/models/rally.model';
import { RallyService } from '../../shared/services/rally.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rallies-actuales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rallies-actuales.component.html',
  styleUrls: ['./rallies-actuales.component.css'],
})
export class RalliesActualesComponent implements OnInit {
  ralliesActuales: Rally[] = [];
  rallies: any;

  constructor(private rallyService: RallyService, private router: Router) {}

  ngOnInit(): void {
    this.rallyService.getAllRallies().subscribe((rallies) => {
      console.log('TODOS LOS RALLIES:', rallies);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filtrar rallies activos
      this.ralliesActuales = rallies.filter((rally) => {
        const startDate = new Date(rally.start_date); // Fecha de inicio
        const endDate = new Date(rally.end_date); // Fecha de fin
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const isActive = startDate <= today && endDate >= today; // Comprobamos si el rally está activo
        console.log(
          `Rally: ${rally.title} - Inicio: ${startDate.toISOString()} - Fin: ${endDate.toISOString()} - ¿Activo?: ${isActive}`
        );

        return isActive; // Si está activo, lo mostramos
      });

      console.log('Rallies activos:', this.ralliesActuales);
    });
  }

  // Método para redirigir al usuario al panel de usuario
  volverAlPanelUsuario(): void {
    this.router.navigate(['user/dashboard']);
  }
}
