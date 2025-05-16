import { Component, OnInit } from '@angular/core';
import { Rally } from '../../shared/models/rally.model';
import { RallyService } from '../../shared/services/rally.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rallies-actuales',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './rallies-actuales.component.html',
  styleUrls: ['./rallies-actuales.component.css'],
})
export class RalliesActualesComponent implements OnInit {
  ralliesActuales: Rally[] = [];

  constructor(private rallyService: RallyService) {}

  ngOnInit(): void {
    this.rallyService.getAllRallies().subscribe((rallies) => {
      const today = new Date();
      // Filtrar los rallies actuales (que están en curso)
      this.ralliesActuales = rallies.filter(
        (rally) =>
          new Date(rally.start_date) <= today && new Date(rally.end_date) >= today
      );
    });
  }
}
