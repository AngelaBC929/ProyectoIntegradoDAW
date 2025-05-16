import { Component, OnInit } from '@angular/core';
import { RallyService } from '../../shared/services/rally.service';
import { Rally } from '../../shared/models/rally.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  userId: number = 0; // 👈 Aquí declaras el userId


  constructor(private rallyService: RallyService, private router: Router) {}

  ngOnInit(): void {
    // 👇 Obtener userId desde localStorage, por ejemplo
    const storedUser = localStorage.getItem('userId');
    if (storedUser) {
      this.userId = +storedUser; // convertir a número
    }

    // Primero obtener las inscripciones del usuario
    this.rallyService.getUserInscriptions(this.userId).subscribe(inscripciones => {
      this.userInscribedRallies = inscripciones;

      // Luego, obtener los rallies y filtrar los actuales
      this.rallyService.getAllRallies().subscribe((rallies) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        this.ralliesActuales = rallies.filter(rally => {
          const startDate = new Date(rally.start_date);
          const endDate = new Date(rally.end_date);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          return startDate <= currentDate && endDate >= currentDate;
        });
      });
    });
  }

  isUserInscribed(rallyId: number): boolean {
    return this.userInscribedRallies.includes(rallyId);
  }

  apuntarse(rallyId: number): void {
    this.rallyService.apuntarseARally(rallyId).subscribe((response) => {
      if (response.success) {
        this.userInscribedRallies.push(rallyId);
      }
    });
  }

  cancelarInscripcion(rallyId: number): void {
    this.rallyService.cancelarInscripcion(rallyId).subscribe((response) => {
      if (response.success) {
        this.userInscribedRallies = this.userInscribedRallies.filter(id => id !== rallyId);
      }
    });
  }
  // Método para redirigir al usuario al panel de usuario
  goBackToUserPanel(): void {
    this.router.navigate(['user']); 
  }
}
