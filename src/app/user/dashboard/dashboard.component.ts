import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ChartData, ChartType, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { UserService } from '../../shared/services/user.service';
import { PhotoService } from '../../shared/services/photo.service';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

// Importa y registra controladores OBLIGATORIOS de Chart.js
import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tabActivo = 'perfil';
  usuario: User | null = null;
  tituloFoto: string = '';
  topRallies: { id: number, title: string, inscritos: number }[] = [];

  isModalOpen = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
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

  constructor(
    private router: Router,
    private userService: UserService,
    private photoService: PhotoService,
    private sweetAlert: SweetAlertService,
    private http: HttpClient,
    private authenticationService: AuthenticationService  
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(+userId).subscribe({
        next: (userData) => {
          this.usuario = userData;
        },
        error: (err) => {
          console.error('Error cargando el usuario:', err);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }

    this.cargarTopRallies();
  }

  seleccionarTab(tab: string) {
    this.tabActivo = tab;
  }

  cargarTopRallies() {
    const url = `${environment.apiUrl}/inscripciones.php?stats=top`;
    this.http.get<any>(url).subscribe({
      next: (response: { success: any; topRallies: { id: number; title: string; inscritos: number; }[]; message: string; }) => {
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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.selectedFile && this.usuario) {
      const userId = this.usuario.id;
      const rallyId = 456;
      const title = this.tituloFoto || 'Sin título';

      this.photoService.uploadPhoto(this.selectedFile, userId, rallyId, title).subscribe({
        next: () => {
          this.sweetAlert.success('Foto subida correctamente');
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al subir la foto:', err);
          this.sweetAlert.error('Error', 'Error al subir la foto');
        }
      });
    } else {
      this.sweetAlert.info('Por favor selecciona una foto.');
    }
  }

modificarPerfil(): void {
  if (this.usuario) {
    const updatedUser: User = { ...this.usuario };
    this.userService.updateUser(this.usuario.id, updatedUser).subscribe({
      next: () => {
        this.sweetAlert.success('Perfil actualizado correctamente');
        this.authenticationService.setUsername(updatedUser.name);

      },
      error: () => {
        this.sweetAlert.error('Error', 'No se pudo actualizar el perfil');
      }
    });
  }
}


  entrarProximosRallies() {
    this.router.navigate(['/proximos-rallies']);
  }

  entrarRalliesActuales() {
    this.router.navigate(['/rallies-actuales']);
  }

  entrarRalliesPasados() {
    this.router.navigate(['/rallies-pasados']);
  }

  entrarGaleria() {
    this.router.navigate(['/gallery'], { queryParams: { from: 'dashboard' } });
  }

  goBackToUserPanel(): void {
    this.router.navigate(['user/dashboard']);
  }
}
