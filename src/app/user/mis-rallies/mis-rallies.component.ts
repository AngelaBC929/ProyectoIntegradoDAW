import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InscripcionesService } from '../../shared/services/inscripciones.service';
import { PhotoService } from '../../shared/services/photo.service';
import { UserService } from '../../shared/services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-rallies',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  tituloFoto: string = ''; // Añade esta propiedad en tu componente
  popupVisible: boolean = false;
  popupMensaje: string = '';


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
  
    // Verificar cuántas fotos ha subido el usuario para este rally
    const fotosSubidas = this.fotosPorRally[rally.id]?.length || 0;
  
    // Si ya ha subido 3 fotos, mostrar el popup y no abrir el modal
    if (fotosSubidas >= 3) {
      this.mostrarPopup('Ya has subido el número máximo de fotos para este rally.');
      return; // No abrir el modal
    }
  
    // Si no ha alcanzado el límite, abrir el modal
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
        console.log(res);  // Verifica la respuesta aquí
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
      const title = this.tituloFoto || this.selectedFile?.name || 'Sin título';
  
      if (rallyId) {
        this.photoService.uploadPhoto(this.selectedFile, userId, rallyId, title).subscribe({
          next: (response) => {
            alert('Foto subida correctamente');
            this.loadFotosSubidas(rallyId); // Refrescar fotos
            this.selectedFile = null;
            this.imagePreview = null;
            this.tituloFoto = ''; // Limpiar el campo
            this.closeModal(); // <- Aquí se cierra el modal automáticamente
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
  

mostrarPopup(mensaje: string) {
  this.popupMensaje = mensaje;
  this.popupVisible = true;

  // Después de 3 segundos, cerrar el popup
  setTimeout(() => {
    this.popupVisible = false;
  }, 5000); // Popup se cierra automáticamente después de 5 segundos
}

  
  goBackToUserPanel(): void {
    this.router.navigate(['user/dashboard']);
  }
}
