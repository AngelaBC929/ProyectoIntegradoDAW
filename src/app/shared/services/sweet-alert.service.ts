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


}