import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rallies-actuales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rallies-actuales.component.html',
  styleUrls: ['./rallies-actuales.component.css']
})
export class RalliesActualesComponent implements OnInit {
  ralliesActuales: any[] = [];
  userInscribedRallies: number[] = [];
  userId: number = 0;
  selectedFiles: FileList | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.id;
    this.userInscribedRallies = user.ralliesInscribed || [];
    this.loadRallies();
  }

  loadRallies(): void {
    this.http.get<any[]>('http://localhost/backendRallyFotografico/rallies.php').subscribe({
      next: (data) => {
        this.ralliesActuales = data;
      },
      error: (err) => {
        console.error('Error al cargar los rallies:', err);
      }
    });
  }

  apuntarse(rallyId: number): void {
    this.http.post('http://localhost/backendRallyFotografico/inscripciones.php', {
      rallyId: rallyId,
      userId: this.userId
    }).subscribe({
      next: () => {
        alert('¡Inscripción exitosa!');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.ralliesInscribed) user.ralliesInscribed = [];
        user.ralliesInscribed.push(rallyId);
        localStorage.setItem('user', JSON.stringify(user));
        this.userInscribedRallies.push(rallyId);
        this.loadRallies();
      },
      error: (err) => {
        alert('Error al inscribirse en el rally: ' + (err.error?.message || 'intenta más tarde'));
      }
    });
  }

  isUserInscribed(rallyId: number): boolean {
    return this.userInscribedRallies.includes(rallyId);
  }

  onFileChange(event: any): void {
    this.selectedFiles = event.target.files;
  }

  submitPhotos(rallyId: number): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      alert('Por favor selecciona las fotos a cargar.');
      return;
    }

    const filesArray = Array.from(this.selectedFiles);
    const maxFotos = 3;

    if (filesArray.length > maxFotos) {
      alert(`Solo puedes subir hasta ${maxFotos} fotos`);
      return;
    }

    filesArray.forEach((file, index) => {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('user_id', this.userId.toString());
      formData.append('rally_id', rallyId.toString());

      this.http.post('http://localhost/backendRallyFotografico/subir_fotos.php', formData).subscribe({
        next: (res: any) => {
          console.log(`Foto ${index + 1} subida:`, res);
          if (index === filesArray.length - 1) {
            alert('Fotos subidas correctamente');
            this.loadRallies();
          }
        },
        error: (err) => {
          alert('Error al subir la foto: ' + (err.error?.error || 'intenta más tarde'));
        }
      });
    });
  }

  // Verifica si el usuario ya ha subido las 3 fotos
  haSubidoLasTresFotos(rallyId: number): boolean {
    const rally = this.ralliesActuales.find(r => r.id === rallyId);
    return rally && rally.photos && rally.photos.length >= 3;
  }

  cancelarInscripcion(rallyId: number): void {
    // Verificamos si el usuario ha subido al menos 3 fotos
    this.http.get<any[]>(`http://localhost/backendRallyFotografico/getFotos.php?rallyId=${rallyId}&userId=${this.userId}`).subscribe({
      next: (photosData) => {
        const numberOfPhotos = photosData.length;
        if (numberOfPhotos >= 3) {
          alert('No puedes cancelar la inscripción porque has subido 3 fotos.');
          return;
        }
  
        // Si tiene menos de 3 fotos, procedemos con la cancelación
        this.http.post('http://localhost/backendRallyFotografico/inscripciones.php', {
          rallyId: rallyId,
          userId: this.userId,
          action: 'cancel' // Este campo es solo para ayudar al backend a entender que es una cancelación
        }).subscribe({
          next: (response: any) => {
            if (response.success) {
              alert('Inscripción cancelada con éxito');
              this.loadRallies();  // Recargar los rallies para actualizar el estado
            } else {
              alert('Error al cancelar inscripción: ' + response.message);
            }
          },
          error: (err) => {
            alert('Error al cancelar inscripción: ' + (err.error?.message || 'intenta más tarde'));
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener las fotos:', err);
        alert('Error al verificar las fotos del rally.');
      }
    });
  }
  
  goBackToUserPanel(): void {
    this.router.navigate(['user']);
  }
}
