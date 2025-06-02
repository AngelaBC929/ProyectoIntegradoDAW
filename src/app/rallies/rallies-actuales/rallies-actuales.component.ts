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
  userInscriptions: number[] = []; // Para almacenar los rallies en los que el usuario está inscrito.


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
        return startDate <= today && endDate >= today;
      });

      // Obtener las inscripciones del usuario
      const userId = parseInt(localStorage.getItem('userId') || '0', 10);
      if (userId) {
        this.rallyService.userInscriptions$.subscribe((inscriptions: number[]) => {
          this.userInscriptions = inscriptions;
        });
      }
    });
  }

  // Método para verificar si el usuario está inscrito en un rally
  estaInscrito(rallyId: number): boolean {
    return this.userInscriptions.includes(rallyId);
  }
  

  // Método para inscribirse o desinscribirse
  alternarInscripcion(rallyId: number): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (!userId) {
      console.error('Usuario no autenticado.');
      return;
    }
    const inscrito = this.estaInscrito(rallyId);
  
    this.rallyService.toggleInscripcion(rallyId, userId, inscrito).subscribe(
      (response) => {
        if (inscrito) {
          // Estaba inscrito, ahora lo desinscribimos
          this.userInscriptions = this.userInscriptions.filter(id => id !== rallyId);
        } else {
          // No estaba inscrito, ahora lo inscribimos
          this.userInscriptions.push(rallyId);
        }
      },
      (error) => {
        console.error('Error al alternar inscripción:', error);
      }
    );
  }
  
  // Método para redirigir al usuario al panel de usuario
  volverAlPanelUsuario(): void {
    this.router.navigate(['user/dashboard']);
  }
}