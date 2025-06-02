import { Component, OnInit } from '@angular/core';
import { RallyService } from '../../shared/services/rally.service';
import { Rally } from '../../shared/models/rally.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proximos-rallies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proximos-rallies.component.html',
  styleUrls: ['./proximos-rallies.component.css'],
})
export class ProximosRalliesComponent implements OnInit {
  ralliesProximos: Rally[] = [];

  constructor(private rallyService: RallyService, private router: Router) { }

  ngOnInit(): void {
    this.rallyService.getAllRallies().subscribe((rallies) => {
      const today = new Date();
      this.ralliesProximos = rallies.filter(
        (rally) => new Date(rally.start_date) > today
      );
      console.log('Rallies próximos:', this.ralliesProximos);
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
