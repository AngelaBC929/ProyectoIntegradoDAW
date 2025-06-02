import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  success(title: string, text?: string) {
    Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#7b4f24',
      timer: 2000,
      showConfirmButton: false,
      position: 'center'
    });
  }

  error(title: string, text?: string) {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#7b4f24',
      position: 'center'
    });
  }

  warning(title: string, text?: string) {
    Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#7b4f24',
      position: 'center'
    });
  }

  info(title: string, text?: string) {
    Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: '#7b4f24',
      position: 'center'
    });
  }

  confirm(title: string, text: string): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      position: 'center'
    }).then(result => result.isConfirmed);
  }

//ESTO ES UN EJEMPLO DE CÓMO PODRÍA HACERLO PARA PERSONALIZAR LOS BOTONES
// confirm(
//   title: string,
//   text: string,
//   confirmText: string = 'Sí, eliminar',
//   cancelText: string = 'Cancelar'
// ): Promise<boolean> {
//   return Swal.fire({
//     title,
//     text,
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#d33',
//     cancelButtonColor: '#aaa',
//     confirmButtonText: confirmText,
//     cancelButtonText: cancelText,
//     position: 'center'
//   }).then(result => result.isConfirmed);
// }

// Y EN LA VISTA QUE HAGA FALTA SE LLAMA 
// this.sweetAlert.confirm('¿Salir sin guardar?', 'Perderás los cambios no guardados.', 'Salir', 'Volver')

  

}