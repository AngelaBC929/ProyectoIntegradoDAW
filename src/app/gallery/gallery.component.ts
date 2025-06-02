import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../shared/services/photo.service';
import { SweetAlertService } from '../shared/services/sweet-alert.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  rallies: {
    id: number;
    title: string;
    start_date?: string;
    end_date?: string;
    photos: any[];
    winnerPhoto?: any[];  // Propiedad para las fotos ganadoras de cada rally
  }[] = [];
  votedPhotos: Set<number> = new Set();
  currentPage: number = 1; // Página global
  limit: number = 6; // Fotos por página
  totalPhotos: number = 0; // Total de fotos, para calcular las páginas

  constructor(private photoService: PhotoService, private router: Router, private route: ActivatedRoute, private sweetAlert: SweetAlertService) {}

  ngOnInit() {
    this.loadRallies();
  }

  loadRallies() {
    this.photoService.getFotosAprobadasPaginated(this.currentPage, this.limit).subscribe({
      next: (response) => {
        console.log('Fotos aprobadas:', response);
        this.rallies = this.groupPhotosByRally(response.photos || []); // Agrupa las fotos por rally
        this.totalPhotos = response.totalPhotos || 0; // Establece el total de fotos para la paginación
        this.loadVotedPhotos();

        // Establecer las fotos ganadoras para cada rally
        this.setWinners();
      },
      error: (err) => {
        console.error('Error al cargar fotos aprobadas:', err);
      }
    });
  }

  // Función para establecer las fotos ganadoras de cada rally
setWinners() {
  this.rallies.forEach(rally => {
    let maxVotes = 0;
    let winners: any[] = [];

    // Encuentra el número máximo de votos
    rally.photos.forEach(photo => {
      if (photo.votos > maxVotes) {
        maxVotes = photo.votos; // Establece el nuevo máximo
        winners = [photo]; // Reinicia los ganadores si se encuentra un nuevo máximo
      } else if (photo.votos === maxVotes) {
        winners.push(photo); // Agrega la foto si tiene el mismo número de votos
      }
    });

    // Solo asigna ganadores si hay fotos con más de 0 votos
    if (maxVotes > 0) {
      rally.winnerPhoto = winners; // Asigna las fotos con el máximo número de votos
    } else {
      rally.winnerPhoto = []; // Si no hay fotos con más de 0 votos, no hay ganadores
    }
  });
}


isWinner(photo: any, rally: any): boolean {
  // Verifica si la foto está en la lista de ganadores para este rally
  return rally.winnerPhoto?.some((winner: any) => winner.id === photo.id) ?? false;
}


  // Función para agrupar las fotos por rally
  groupPhotosByRally(photos: any[]): any[] {
    const grouped: { [key: number]: any } = {};

    photos.forEach(photo => {
      const rallyId = photo.rally_id;
      if (!grouped[rallyId]) {
        grouped[rallyId] = {
          id: rallyId,
          title: photo.rally_title || 'Rally sin nombre',
          start_date: photo.rally_start_date,
          end_date: photo.rally_end_date,
          photos: []
        };
      }
      grouped[rallyId].photos.push(photo);
    });

    return Object.values(grouped);
  }

  loadVotedPhotos() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const votedPhotos = localStorage.getItem(`userVotedPhotos_${userId}`);
      if (votedPhotos) {
        this.votedPhotos = new Set(JSON.parse(votedPhotos));
      }
    }
  }

  hasVoted(photoId: number): boolean {
    return this.votedPhotos.has(photoId);
  }

  vote(photoId: number) {
    const userId = localStorage.getItem('userId');
    const parsedUserId = parseInt(userId || '', 10);

    if (!userId || isNaN(parsedUserId)) {
      this.sweetAlert.info('Debes iniciar sesión para votar.')
      return;
    }

    if (this.hasVoted(photoId)) {
      this.sweetAlert.info('Ya has votado por esta foto.')
      return;
    }

    this.photoService.vote(photoId, parsedUserId).subscribe({
      next: (response) => {
        console.log('Voto registrado correctamente:', response);

        const photo = this.findPhotoById(photoId);
        if (photo) {
          photo.votos = (photo.votos || 0) + 1;
        }

        this.votedPhotos.add(photoId);
        localStorage.setItem(`userVotedPhotos_${userId}`, JSON.stringify(Array.from(this.votedPhotos)));

        this.sweetAlert.success('¡Voto registrado!', '¡Gracias por participar!');
      },
      error: (err) => {
        console.error('Error al votar:', err);
        this.sweetAlert.error('Error al votar: ' + (err.error?.error || 'Intenta más tarde.'));
      }
    });
  }

  findPhotoById(photoId: number): any | null {
    for (let rally of this.rallies) {
      const photo = rally.photos.find(p => p.id === photoId);
      if (photo) return photo;
    }
    return null;
  }

  // Funciones de paginación global
  nextPage() {
    if ((this.currentPage * this.limit) < this.totalPhotos) {
      this.currentPage++;
      this.loadRallies(); // Carga la siguiente página
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRallies(); // Carga la página anterior
    }
  }

  hasMorePhotos(): boolean {
    return (this.currentPage * this.limit) < this.totalPhotos; // Verifica si hay más fotos
  }

 goBackToHome(): void {
  const from = this.route.snapshot.queryParamMap.get('from');
  if (from === 'dashboard') {
    this.router.navigate(['/user/dashboard']);
  } else {
    this.router.navigate(['/home']);
  }
}

}
