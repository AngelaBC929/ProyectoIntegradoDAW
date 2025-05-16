import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-proximos-rallies',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './proximos-rallies.component.html',
  styleUrls: ['./proximos-rallies.component.css']
})
export class ProximosRalliesComponent {
  // Aquí puedes agregar datos de ejemplo o hacer peticiones a un backend
  rallies = [
    { name: 'Rally A', description: 'Un rally emocionante para todos.' },
    { name: 'Rally B', description: 'Explora nuevas rutas y gana premios.' },
    { name: 'Rally C', description: 'Captura la mejor foto en este rally.' }
  ];
}
