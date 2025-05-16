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

  constructor(private rallyService: RallyService, private router: Router) {}

  ngOnInit(): void {
    this.rallyService.getAllRallies().subscribe((rallies) => {
      const today = new Date();
      // Filtrar los rallies próximos (que empiezan después de hoy)
      this.ralliesProximos = rallies.filter(
        (rally) => new Date(rally.start_date) > today
      );
    });
  }
   // Método para redirigir al usuario al panel de usuario
   goBackToUserPanel(): void {
    this.router.navigate(['user']); 
  }
}
