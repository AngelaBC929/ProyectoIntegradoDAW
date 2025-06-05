import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserService } from '../../shared/services/user.service';
import { RallyService } from '../../shared/services/rally.service';


@Component({
  selector: 'app-user-photos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-photos.component.html',
  styleUrls: ['./user-photos.component.css']
})
export class UserPhotosComponent implements OnInit {
  allPhotos: any[] = [];
  isModalOpen: boolean = false;
  selectedPhoto: any = null;
  private apiUrl = environment.apiUrl;
  rallies: any[] = [];


  constructor(
    private http: HttpClient,
    private router: Router,
    private photoService: UserService,
    private rallyService: RallyService
  ) { }

  ngOnInit(): void {
    this.loadRallies();
  }
  loadRallies() {
    this.rallyService.getAllRallies().subscribe((rallies: any[]) => {
      this.rallies = rallies;
      this.loadPhotos(); // ← una vez que tienes los rallies, cargas las fotos
    });
  }

  loadPhotos() {
    this.http.get(`${this.apiUrl}/fotos.php?action=getAllPhotos`)
      .subscribe((response: any) => {
        if (response.photos) {
          this.allPhotos = response.photos.map((foto: any) => {
            const rally = this.rallies.find(r => r.title === foto.rally_name);
            return {
              ...foto,
              photo_url: `${this.apiUrl}/${foto.photo_url}`,
              rally: rally  // <-- asignamos el rally completo
            };
          });
        } else {
          console.error('No se encontraron fotos');
        }
      }, error => {
        console.error('Error al cargar fotos', error);
      });

  }

  openModal(photo: any) {
    this.selectedPhoto = photo;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedPhoto = null;
  }

  updatePhotoStatus(status: string) {
    if (this.selectedPhoto) {
      console.log('Enviando solicitud con estos datos:', {
        photo_id: this.selectedPhoto.id,
        status: status
      });

      this.photoService.updatePhotoStatus(this.selectedPhoto.id, status)
        .subscribe((response: any) => {
          if (response.success) {
            this.selectedPhoto.status = status;
            this.selectedPhoto.isReviewed = true;

            const updatedIndex = this.allPhotos.findIndex(photo => photo.id === this.selectedPhoto.id);
            if (updatedIndex !== -1) {
              this.allPhotos[updatedIndex].status = status;
            }

            this.closeModal();
          } else {
            console.error('Error al actualizar el estado de la foto');
          }
        }, (error: any) => {
          console.error('Error en la solicitud HTTP', error);
        });
    } else {
      console.error('No se ha seleccionado ninguna foto');
    }
  }

 hasRallyEnded(photo: any): boolean {
  const rally = photo.rally;
  if (!rally || !rally.end_date) return false;
  const today = new Date();
  const endDate = new Date(rally.end_date);
  return today > endDate;
}


  goBackToAdminPanel(): void {
    this.router.navigate(['admin']);
  }
}
