import { Component, inject } from '@angular/core';
import { MunicipiosService } from '../../../auth/services/municipios.service';
import { LocalidadesService } from '../../../auth/services/localidades.service';
import { Municipio } from '../../../auth/interfaces/municipio.interface';
import { Localidades } from '../../../auth/interfaces/localidades.interface';
import { TiposSangreService } from '../../../auth/services/tiposSangre.service';
import { TiposSangre } from '../../../auth/interfaces/tipos-sangre';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../service/validators.service';
import { ValidatorCurpService } from '../../service/validator.curp.service';
import { GuardarBeneficiarioService } from '../../service/guardarBeneficiario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { TipoDiscapacidadService } from '../../../auth/services/tipoDiscapacidad.service';
import { TipoDiscapacidad } from '../../../auth/interfaces';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.css'
})
export class NewPageComponent {
  municipios: Municipio[] = [];
  localidades: Localidades[] = [];
  tiposSangre: TiposSangre[] = [];
  tiposDiscapacidad: TipoDiscapacidad[] = [];
  listado_municipios: string = '';
  listadoTipoSangre: string = '';
  listado_localidades: string = '';
  isSubmitting: boolean = false;
  selectedImage: string | ArrayBuffer | null = null; // Propiedad para almacenar la URL de la imagen
  imagenSeleccionada: File | null = null;
  isLoading = false; // Variable para controlar la visibilidad del loader


  public formNuevoBeneficiario: FormGroup = this.fb.group({
    nombreBeneficiario: ['', [Validators.required]],
    apellidPaternoBeneficiario: ['', [Validators.required]],
    apellidoMaternoBeneficiario: ['', [Validators.required]],
    curpBeneficiario: ['', [Validators.required, Validators.pattern(this.validatorsService.curpPattern)], [new ValidatorCurpService()]],
    idMunicipioBeneficiario: ['', [Validators.required]],
    idLocalidadBeneficiario: ['', [Validators.required]],
    direccionBeneficiario: ['', [Validators.required]],
    tipoSangreBeneficiario: ['', [Validators.required]],
    alergiasBeneficiario: ['', [Validators.required]],
    telefonoEmergenciaBeneficiario: ['', [Validators.required]],
    comentariosBeneficiario: ['', [Validators.required]],
    idTipoDiscapacidadBeneficiario: ['', [Validators.required]],
    imagenBeneficiario: ['', [Validators.required]],

  })

  constructor(
    private municipiosService: MunicipiosService,
    private localidadesService: LocalidadesService,
    private tiposSangreService: TiposSangreService,
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private guardarBeneficiarioService: GuardarBeneficiarioService,
  ) { }
  private router = inject(Router);


  isValiedField(campo: string): boolean | null {
    return this.validatorsService.isValiedField(this.formNuevoBeneficiario, campo)
  }

  ngOnInit(): void {
    this.municipiosService.obtener_listado_munciipios().subscribe(listadoMunicipios => {
      this.municipios = listadoMunicipios.municipios;
    })

    this.tiposSangreService.obtener_listado_alergias().subscribe(listadoTiposSangre => {
      this.tiposSangre = listadoTiposSangre.tipos_sangre;
    })

    this.tipoDiscapacidadService.obtener_listado_dicapacidades().subscribe(listadoDiscapacidad => {
      this.tiposDiscapacidad = listadoDiscapacidad.tipos_discapacidad;
    })

  }
  obtener_localidades_por_municipio(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const idMunicipio = selectElement.value;
    if (idMunicipio != '') {
      this.localidadesService.obtener_localidades_por_municipio(idMunicipio).subscribe(listadoLocalidades => {
        this.localidades = listadoLocalidades.localidades;
      })
    }

  }

  onValidate() {
    if (this.formNuevoBeneficiario.invalid) {
      this.formNuevoBeneficiario.markAllAsTouched();
      return;
    }
    else {
      this.isLoading = true;
      this.isSubmitting = true; // Deshabilita el botón al iniciar el envío
      this.guardarBeneficiarioService.guardarBeneficiario(this.formNuevoBeneficiario, this.imagenSeleccionada)
        .subscribe({
          next: (respuesta) => { // Tipificamos la respuesta
            if (respuesta.error != true) {
              Swal.fire({
                title: "Correcto",
                text: "Se registró el beneficiario correctamente correctamente",
                icon: "success"
              }).then(() => {
                this.isSubmitting = false; // Habilita el botón después del envío
                this.selectedImage = null;
                this.isLoading = false;
                this.formNuevoBeneficiario.reset();
              });
            } else {
              this.isSubmitting = false; // Habilita el botón si hay un error
              this.isLoading = false;
              Swal.fire('Error', 'Error al registar verifique sus datos' || 'Error desconocido', 'error');
            }
          },
          error: (message) => {
            Swal.fire('Error', message.error, 'error');
            this.isLoading = false;
            this.isSubmitting = false; // Habilita el botón si hay un error
          }
        });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      // Validación de tipo de archivo (JPEG o PNG)
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        // Validación de tamaño de archivo (1 MB)
        if (file.size <= 1048576) {
          // Validación de dimensiones (300px alto x 200px ancho)
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            if (img.width === 200 && img.height === 300) {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                this.selectedImage = reader.result;
                this.imagenSeleccionada = file;
              };
            } else {
              Swal.fire('Error', 'La imagen debe medir 200px de ancho por 300px de alto.', 'error');
              this.selectedImage = null; // Limpia la imagen seleccionada si no cumple con las dimensiones
            }
          };

          // Manejo de errores en la carga de la imagen
          img.onerror = () => {
            Swal.fire('Error', 'No se pudo cargar la imagen para validar las dimensiones.', 'error');
            this.selectedImage = null; // Limpia la imagen seleccionada si no se pudo cargar
          };
        } else {
          Swal.fire('Error', "La imagen no puede pesar más de 1MB.", 'error');
        }
      } else {
        Swal.fire('Error', "Solo se aceptan imágenes en formato JPG o PNG.", 'error');
      }
    }
  }

  convertirCurpAMayusculas() {
    const curpControl = this.formNuevoBeneficiario.get('curpBeneficiario');
    if (curpControl) {
      const curpValue = curpControl.value;
      curpControl.setValue(curpValue.toUpperCase(), { emitEvent: false }); // Evita un ciclo infinito
    }
  }
}
