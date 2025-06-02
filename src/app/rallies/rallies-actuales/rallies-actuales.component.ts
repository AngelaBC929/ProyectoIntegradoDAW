import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Rally } from '../../shared/models/rally.model';
import { RallyService } from '../../shared/services/rally.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rallies-actuales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rallies-actuales.component.html',
  styleUrls: ['./rallies-actuales.component.css'],
})
export class RalliesActualesComponent implements OnInit, OnDestroy {
  ralliesActuales: Rally[] = [];
  userInscriptions: number[] = [];
  fotosCompletadas: { [rallyId: number]: number } = {};

  private subscriptions = new Subscription();

  constructor(
    private rallyService: RallyService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Obtener todos los rallies
    const ralliesSub = this.rallyService.getAllRallies().subscribe((rallies) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.ralliesActuales = rallies.filter((rally) => {
        const startDate = new Date(rally.start_date);
        const endDate = new Date(rally.end_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return startDate <= today && endDate >= today;
      });

      const userId = parseInt(localStorage.getItem('userId') || '0', 10);
      if (userId) {
        // Cargar inscripciones del usuario
        this.rallyService.loadUserInscriptions(userId);

        const inscriptionsSub = this.rallyService.userInscriptions$.subscribe(
          (inscriptions) => {
            this.userInscriptions = inscriptions;

            // Limpiar fotos completadas previas
            this.fotosCompletadas = {};

            // Para cada inscripción, obtener fotos subidas
            inscriptions.forEach((rallyId) => {
              const fotosSub = this.rallyService
                .getFotosSubidas(rallyId, userId)
                .subscribe((count) => {
                  this.fotosCompletadas[rallyId] = count;
                  this.cdRef.detectChanges();
                });
              this.subscriptions.add(fotosSub);
            });
            this.cdRef.detectChanges();
          }
        );
        this.subscriptions.add(inscriptionsSub);
      }
    });

    this.subscriptions.add(ralliesSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  estaInscrito(rallyId: number): boolean {
    return this.userInscriptions.includes(rallyId);
  }

  alternarInscripcion(rallyId: number): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (!userId) {
      console.error('Usuario no autenticado.');
      return;
    }

    const inscrito = this.estaInscrito(rallyId);

    this.rallyService
      .toggleInscripcion(rallyId, userId, inscrito)
      .subscribe(
        (response) => {
          if (response.success) {
            if (inscrito) {
              this.userInscriptions = this.userInscriptions.filter(
                (id) => id !== rallyId
              );
              delete this.fotosCompletadas[rallyId];
            } else {
              this.userInscriptions.push(rallyId);
              this.fotosCompletadas[rallyId] = 0;
            }
            this.cdRef.detectChanges();
          } else {
            alert(response.message || 'Error al alternar inscripción.');
          }
        },
        (error) => {
          console.error('Error al alternar inscripción:', error);
          alert(error.message || 'Error de conexión o servidor. Inténtalo más tarde.');
        }
      );
  }

 getIconClassByTheme(tema: string): string {
  if (!tema) return 'fa-solid fa-question';

  const cleanedTema = tema.trim().toLowerCase();

  switch (cleanedTema) {
    case 'fotografia': return 'fa-solid fa-camera-retro'
    case 'naturaleza': return 'fa-solid fa-tree';
    case 'deporte': return 'fa-solid fa-person-hiking';
    case 'animales': return 'fa-solid fa-paw';
    case 'comida': return 'fa-solid fa-utensils';
    case 'mar y playa': return 'fa-solid fa-umbrella-beach';
    case 'paisaje urbano': return 'fa-solid fa-city';
    default: return 'fa-solid fa-question';
  }
}


  haCompletadoRally(rallyId: number): boolean {
    return (this.fotosCompletadas[rallyId] || 0) >= 3;
  }

  volverAlPanelUsuario(): void {
    this.router.navigate(['user/dashboard']);
  }
}
