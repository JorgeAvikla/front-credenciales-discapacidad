import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GuardarBeneficiarioService } from '../../service/guardarBeneficiario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styles: ``
})
export class PruebasComponent {

  miFormulario: FormGroup;
  imagenSeleccionada: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private guardarBeneficiarioService: GuardarBeneficiarioService,

  ) {
    this.miFormulario = this.fb.group({
      nombre: [''],
      imagen: [null]

    });

  }

  onSeleccionarImagen(event: any) {
    this.imagenSeleccionada = event.target.files[0];
  }

  enviarFormulario2() {
    // console.Consolelog('pureba')
    if (this.miFormulario.valid && this.imagenSeleccionada) {
      const formData = new FormData();
      formData.append('nombre', this.miFormulario.get('nombre')?.value);
      formData.append('imagen', this.imagenSeleccionada);
      console.log(formData);
      this.http.post('http://10.19.121.76:8080/pruebas/subir_imagen', formData).subscribe(
        (response) => console.log(response),
        (error) => console.error(error)
      );
    }
  }

  enviarFormulario() {
    // if (this.miFormulario.valid && this.imagenSeleccionada) {
    //   this.guardarBeneficiarioService.guardarBeneficiario_imagen(this.miFormulario, this.imagenSeleccionada)
    //     .subscribe({
    //       next: () => {
    //         Swal.fire({
    //           title: "Correcto",
    //           text: "Se registró el usuario correctamente",
    //           icon: "success"
    //         }).then(() => {
    //           this.miFormulario.reset();
    //         });
    //       },
    //       error: (message) => {
    //         console.log(message.error);
    //         Swal.fire('Error', message.error, 'error');
    //       }
    //     });
    // }
  }
}
