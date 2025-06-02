import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../shared/services/photo.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {
  tabActivo: string = 'faqs'; // por si usas tabs

  preguntasRespuestas = [
    {
      pregunta: '¿Cuántas fotos puedo subir por rally?',
      respuesta: 'Puedes subir hasta 3 fotos por cada rally.',
      abierta: false
    },
    {
      pregunta: '¿Qué requisitos deben cumplir las fotos?',
      respuesta: 'Las fotos deben seguir la temática del rally para ser aceptadas.',
      abierta: false
    },
    {
      pregunta: '¿Qué estados puede tener mi foto?',
      respuesta: `
        El equipo de jurado revisará las fotos y cambiará su estado a:<br>
        • <strong>Admitida</strong>: ¡Tu foto participa oficialmente!<br>
        • <strong>Pendiente</strong>: Está en revisión.<br>
        • <strong>Rechazada</strong>: No cumple con los requisitos.
      `,
      abierta: false
    },
    {
      pregunta: '¿Puedo editar o eliminar mis fotos?',
      respuesta: 'Puedes eliminar o reemplazar tus fotos mientras el rally esté activo.',
      abierta: false
    },
    {
      pregunta: '¿Puedo modificar mis fotos tras finalizar el rally?',
      respuesta: 'No. Una vez finalizado el rally, no podrás modificar tus fotos.',
      abierta: false
    },
    {
      pregunta: '¿Cómo funciona la votación?',
      respuesta: 'Puedes votar por tus fotos favoritas en la galería mientras esté activo el rally.',
      abierta: false
    },
    {
      pregunta: '¿Qué pasa con las fotos ganadoras?',
      respuesta: 'Las fotos ganadoras se anunciarán en la galería.',
      abierta: false
    }
  ];

constructor(private photoService: PhotoService, private router: Router ) {}

  ngOnInit(): void {}

  toggle(index: number) {
    this.preguntasRespuestas[index].abierta = !this.preguntasRespuestas[index].abierta;
  }

  seleccionarTab(tab: string) {
    this.tabActivo = tab;
  }
  volverADashboard() {
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/user/dashboard']);
  });
}
    entrarGaleria() {
  this.router.navigate(['/gallery'], { queryParams: { from: 'dashboard' } });
}

  goBackToUserPanel(): void {
    this.router.navigate(['/user/dashboard']);
  }
}
