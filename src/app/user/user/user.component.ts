import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],  // Puedes agregar módulos necesarios aquí
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  constructor(private router: Router) {}
  
 

  // Métodos para redirigir según el botón presionado
  entrarProximosRallies() {
    this.router.navigate(['/proximos-rallies']);  // Ruta que lleva a los próximos rallies
  }

  entrarRalliesActuales() {
    this.router.navigate(['/rallies-actuales']);  // Ruta que lleva a los rallies actuales
  }

  entrarRalliesPasados() {
    this.router.navigate(['/rallies-pasados']);  // Ruta que lleva a los rallies finalizados
  }
}
