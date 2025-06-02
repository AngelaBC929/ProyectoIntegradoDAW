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
  userId: number = 0;
  currentUser: any; // Definir correctamente el currentUser

  constructor(private rallyService: RallyService, private router: Router) {}

  ngOnInit(): void {
    // Obtener el usuario desde localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.id; // Guardar el userId
      this.currentUser = user; // Asignar el currentUser
      console.log('UserId en componente:', this.userId); // Verificar
    }

    // Obtener inscripciones del usuario
    this.rallyService.getUserInscriptions(this.userId).subscribe(inscripciones => {
      console.log('Inscripciones recibidas:', inscripciones); // Verificar
      this.userInscribedRallies = inscripciones;
    });

    // Obtener rallies actuales
    this.rallyService.getAllRallies().subscribe((rallies) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00

      // Filtrar rallies para mostrar solo los actuales
      this.ralliesActuales = rallies.filter(rally => {
        const startDate = new Date(rally.start_date);
        const endDate = new Date(rally.end_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        return startDate <= today && endDate >= today;
      });
    });
  }

// Método para verificar si el usuario está inscrito en un rally
isUserInscribed(rally: Rally): boolean {
  if (rally && Array.isArray(rally.users)) {
    return rally.users.includes(this.currentUser.id); // Verificar si el usuario está en la lista de inscritos
  }
  return false;
}
  // Apuntarse a un rally
  apuntarse(rallyId: number): void {
    this.rallyService.apuntarseARally(rallyId).subscribe(response => {
      if (response.success) {
        this.userInscribedRallies.push(rallyId); // Agregar el rally a las inscripciones del usuario
      }
    });
  }

  // Cancelar inscripción en un rally
  cancelarInscripcion(rallyId: number): void {
    this.rallyService.cancelarInscripcion(rallyId).subscribe(response => {
      if (response.success) {
        this.userInscribedRallies = this.userInscribedRallies.filter(id => id !== rallyId); // Eliminar del array de inscripciones
      }
    });
  }

  // Volver al panel de usuario
  goBackToUserPanel(): void {
    this.router.navigate(['user/dashboard']);
  }
}
