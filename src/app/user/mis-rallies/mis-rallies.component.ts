import { Component, OnInit } from '@angular/core';
import { RallyService } from '../../shared/services/rally.service';
import { CommonModule } from '@angular/common';
import { InscripcionesService } from '../../shared/services/inscripciones.service';
import { PhotoService } from '../../shared/services/photo.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

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

  // Variables para controlar la visibilidad del modal y la vista previa
  isModalOpen = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  usuario: any = null;  // Asegúrate de que tienes al usuario cargado correctamente

  constructor(private inscripcionesService: InscripcionesService, private router: Router, private userService: UserService, private photoService: PhotoService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    console.log('userId desde localStorage:', userId);
  
    if (userId) {
      this.inscripcionesService.obtenerInscripciones(Number(userId)).subscribe({
        next: (response) => {
          if (response.success) {
            this.misRallies = response.inscritos;
          } else {
            console.error(response.message);
          }
        },
        error: (err) => console.error('Error al obtener mis rallies:', err)
      });

      // Suponiendo que tienes un servicio para obtener la información del usuario
      this.userService.getUserById(Number(userId)).subscribe((usuario) => {
        this.usuario = usuario;
      });
    } else {
      console.error('Usuario no encontrado o no tiene un ID válido.');
    }
  }

  openModal(rally: any) {
    console.log("Abriendo el modal para el rally", rally);
    this.rallySeleccionado = rally;  // Asignamos el rally seleccionado
    this.isModalOpen = true;  // Abrimos el modal
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // Manejo del archivo seleccionado
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // 👈 Faltaba asignarla
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  

  onSubmit() {
    if (this.selectedFile && this.usuario) {
      const userId = this.usuario.id; // Obtener el userId del usuario actual
      const rallyId = this.rallySeleccionado?.id;  // Obtener el rallyId del rally seleccionado

      if (rallyId) {
        // Llamar al servicio para subir la foto
        this.photoService.uploadPhoto(this.selectedFile, userId, rallyId).subscribe({
          next: (response) => {
            console.log('Foto subida con éxito:', response);
            alert('Foto subida correctamente');
            this.closeModal();
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
