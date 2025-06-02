import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { PhotoService } from '../../shared/services/photo.service'; // Importamos el servicio de fotos
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tabActivo = 'perfil';
  usuario: User | null = null;
  tituloFoto: string = '';

  // Variables para controlar la visibilidad del modal y la vista previa
  isModalOpen = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private router: Router, 
    private userService: UserService,
    private photoService: PhotoService // Inyectamos el servicio de fotos
  ) {}

  fotos = [
    { titulo: 'Sunset Beach', estado: 'admitida' },
    { titulo: 'Cityscape', estado: 'pendiente' },
    { titulo: 'Forest Trail', estado: 'rechazada' }
  ];

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
  }

  seleccionarTab(tab: string) {
    this.tabActivo = tab;
  }

  openModal() {
    console.log("Abriendo el modal"); // Verificar si el modal se abre correctamente
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
      const userId = this.usuario.id; // Obtener el userId del usuario actual
      const rallyId = 456; // Aquí debes pasar el rallyId adecuado, si lo tienes disponible
      const title = this.tituloFoto || 'Sin título';
; // Aquí puedes obtener el título de un input o asignar un valor por defecto

      // Llamar al servicio para subir la foto
      this.photoService.uploadPhoto(this.selectedFile, userId, rallyId,title).subscribe({
        next: (response) => {
          console.log('Foto subida con éxito:', response);
          alert('Foto subida correctamente');
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al subir la foto:', err);
          alert('Error al subir la foto');
        }
      });
    } else {
      alert('Por favor selecciona una foto.');
    }
  }

  modificarPerfil(): void {
    if (this.usuario) {
      const updatedUser: User = { ...this.usuario };
      this.userService.updateUser(this.usuario.id, updatedUser).subscribe({
        next: () => {
          alert('Perfil actualizado correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar el usuario', error);
        }
      });
    }
  }

  eliminarFoto(foto: any) {
    this.fotos = this.fotos.filter(f => f !== foto);
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
