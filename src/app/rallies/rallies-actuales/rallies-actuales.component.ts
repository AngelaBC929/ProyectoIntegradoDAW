import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-rallies-actuales',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './rallies-actuales.component.html',
  styleUrls: ['./rallies-actuales.component.css']
})
export class RalliesActualesComponent {
  // Aquí también puedes agregar datos de ejemplo o hacer peticiones a un backend
  rallies = [
    { name: 'Rally X', description: 'Participa en el rally en curso.' },
    { name: 'Rally Y', description: 'No te pierdas esta oportunidad.' }
  ];
}
