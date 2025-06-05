import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
// Importa y registra controladores obligatorios de Chart.js
import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
    topRallies: { id: number, title: string, inscritos: number }[] = [];
      errorMessage: string = '';
   // Gráfica
    barChartData: ChartData<'bar'> = {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Inscritos',
          backgroundColor: '#7b4f24'
        }
      ]
    };
    barChartType: ChartType = 'bar';
  

  constructor(private router: Router,private http: HttpClient) {}
  ngOnInit(): void {
    
    
    this.cargarTopRallies();
  }

  cargarTopRallies() {
    const url = `${environment.apiUrl}/inscripciones.php?stats=top`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.success) {
          this.topRallies = response.topRallies;
          this.updateChartData();
        } else {
          this.errorMessage = response.message || 'Error al cargar datos.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Error en la llamada a la API.';
        console.error('Error HTTP:', error);
      }
    });
  }

  updateChartData() {
    this.barChartData = {
      labels: this.topRallies.map(r => r.title),
      datasets: [
        {
          data: this.topRallies.map(r => r.inscritos),
          label: 'Inscritos',
          backgroundColor: '#7b4f24'
        }
      ]
    };
  }


  goToRalliesManagement() {
    this.router.navigate(['/admin/gestion-rallies']);
  }

  goToUsersManagement() {
    this.router.navigate(['/admin/user-control']);
  }

  goToPhotosManagement() {
    this.router.navigate(['/admin/user-photos']);
  }

}

