import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InscripcionesService } from '../../shared/services/inscripciones.service';
import { PhotoService } from '../../shared/services/photo.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-mis-rallies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-rallies.component.html',
  styleUrls: ['./mis-rallies.component.css']
})
export class MisRalliesComponent implements OnInit {
  misRallies: any[] = [];
  rallySeleccionado: any = null;
  isModalOpen = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  usuario: any = null;

  // Mapa para guardar fotos por rally
  fotosPorRally: { [rallyId: number]: any[] } = {};

  constructor(
    private inscripcionesService: InscripcionesService,
    private router: Router,
    private userService: UserService,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('Usuario no encontrado o no tiene un ID válido.');
      return;
    }
  
    this.userService.getUserById(Number(userId)).subscribe((usuario) => {
      this.usuario = usuario;
  
      this.inscripcionesService.obtenerInscripciones(Number(userId)).subscribe({
        next: (response) => {
          if (response.success) {
            this.misRallies = response.inscritos;
  
            // Ahora que tenemos al usuario y los rallies, cargamos las fotos
            for (const rally of this.misRallies) {
              this.loadFotosSubidas(rally.id);
            }
          } else {
            console.error(response.message);
          }
        },
        error: (err) => console.error('Error al obtener mis rallies:', err)
      });
    });
  }
  

  openModal(rally: any) {
    this.rallySeleccionado = rally;
    this.isModalOpen = true;
    if (this.usuario) {
      this.loadFotosSubidas(rally.id);
    }
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
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  loadFotosSubidas(rallyId: number) {
    this.photoService.getFotosPorRallyYUsuario(rallyId, this.usuario.id).subscribe({
      next: (res: any) => {
        this.fotosPorRally[rallyId] = res.photos || [];
      },
      error: (err: any) => {
        console.error('Error al cargar fotos:', err);
        this.fotosPorRally[rallyId] = [];
      }
    });
  }

  onSubmit() {
    if (this.selectedFile && this.usuario) {
      const userId = this.usuario.id;
      const rallyId = this.rallySeleccionado?.id;

      if (rallyId) {
        this.photoService.uploadPhoto(this.selectedFile, userId, rallyId).subscribe({
          next: (response) => {
            alert('Foto subida correctamente');
            this.loadFotosSubidas(rallyId); // Refrescar fotos
            this.selectedFile = null;
            this.imagePreview = null;
          },
          error: (err: any) => {
            console.error('Error al subir la foto:', err);
            alert('Error al subir la foto');
          }
        });
      } else {
        alert('No se ha seleccionado un rally válido.');
      }
    } else {
      alert('Por favor selecciona una foto.');
    }
  }

  goBackToUserPanel(): void {
    this.router.navigate(['user/dashboard']);
  }
}
