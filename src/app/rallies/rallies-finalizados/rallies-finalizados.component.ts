import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-rallies-finalizados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rallies-finalizados.component.html',
  styleUrls: ['./rallies-finalizados.component.css']
})
export class RalliesFinalizadosComponent {
  // Aquí puedes mostrar rallies pasados, también de ejemplo o datos reales
  rallies = [
    { name: 'Rally 1', description: 'Este rally ya ha finalizado.' },
    { name: 'Rally 2', description: 'Revive los momentos de este rally.' }
  ];
}
