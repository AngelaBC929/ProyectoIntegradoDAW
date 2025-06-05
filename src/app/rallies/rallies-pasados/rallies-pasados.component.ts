import { Component, OnInit } from '@angular/core';

import { Rally } from '../../shared/models/rally.model';
import { RallyService } from '../../shared/services/rally.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rallies-pasados',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './rallies-pasados.component.html',
  styleUrls: ['./rallies-pasados.component.css'],
})
export class RalliesPasadosComponent implements OnInit {
  ralliesPasados: Rally[] = [];
  rallies: any;

  constructor(private rallyService: RallyService, private router: Router) {}

  ngOnInit(): void {
    this.rallyService.getAllRallies().subscribe((rallies) => {
      console.log('TODOS LOS RALLIES:', rallies); // 👈
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      this.ralliesPasados = rallies.filter((rally) => {
        const endDate = new Date(rally.end_date);
        endDate.setHours(0, 0, 0, 0);
  
        const isPast = endDate < today;
        console.log(`Rally: ${rally.title} - Fin: ${endDate.toISOString()} - ¿Pasado?: ${isPast}`); // 👈
  
        return isPast;
      });
  
      console.log('Rallies pasados:', this.ralliesPasados); 
    });
  }
   getIconClassByTheme(tema: string): string {
  if (!tema) return 'fa-solid fa-question';

  const cleanedTema = tema.trim().toLowerCase();

  switch (cleanedTema) {
    case 'fotografia': return 'fa-solid fa-camera-retro';
    case 'naturaleza': return 'fa-solid fa-tree';
    case 'deporte': return 'fa-solid fa-person-hiking';
    case 'animales': return 'fa-solid fa-paw';
    case 'comida': return 'fa-solid fa-utensils';
    case 'mar y playa': return 'fa-solid fa-umbrella-beach';
    case 'paisaje urbano': return 'fa-solid fa-city';
    default: return 'fa-solid fa-question';
  }
}


  volverAlPanelUsuario(): void {
    this.router.navigate(['user/dashboard']);
  }
  
}
