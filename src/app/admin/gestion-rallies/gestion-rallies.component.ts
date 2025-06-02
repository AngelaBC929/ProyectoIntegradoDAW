import { Component, OnInit } from '@angular/core';
import { RallyService } from '../../shared/services/rally.service';
import { Router } from '@angular/router';
import { Rally } from '../../shared/models/rally.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-gestion-rallies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-rallies.component.html',
  styleUrls: ['./gestion-rallies.component.css']
})
export class GestionRalliesComponent implements OnInit {
  rallies: Rally[] = [];

  constructor(
    public router: Router,
    private rallyService: RallyService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit(): void {
    // Nos suscribimos a 'rallies$' para obtener los datos actualizados automáticamente
    this.rallyService.rallies$.subscribe(rallies => {
      // Confirmamos que los rallies que estamos recibiendo están correctamente
      console.log('Datos de rallies recibidos en la suscripción:', rallies);
      this.rallies = rallies; // Asignamos todos los rallies tal como los recibe desde el servicio
      console.log('Todos los rallies:', this.rallies);
    });

    // Llamamos a getAllRallies para cargar los rallies por primera vez.
    this.rallyService.getAllRallies().subscribe({
      next: () => console.log('Rallies cargados correctamente'),
      error: (err) => console.error('Error al cargar los rallies:', err)
    });
  }


  // Redirigir al formulario de edición
  editRally(id: number): void {
    this.router.navigate([`/admin/edit-rallies/${id}`]);
  }

  // Eliminar un rally
  deleteRally(id: number): void {
    this.rallyService.getRallyById(id).subscribe(rally => {
      if (rally) {
        const rallyName = rally.title;
        this.sweetAlert.confirm( `¿Estás seguro de que deseas eliminar el rally: ${rallyName}?`, 'Esta acción no se puede deshacer.'
        ).then(isConfirmed => {
          if (isConfirmed) {
            this.rallyService.deleteRally(id).subscribe(() => {
              this.sweetAlert.success('Rally eliminado');
              // Aquí puedes emitir un evento o refrescar la lista si es necesario
            });
          }
        });

      } else {
        this.sweetAlert.warning('No se encontró el rally.');
      }
    });
  }

  // Método para redirigir al usuario al panel de usuario
  goBackToAdminPanel(): void {
    this.router.navigate(['admin']);
  }

}
