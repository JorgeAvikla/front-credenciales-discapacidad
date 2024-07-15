import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuscarBeneficiarioService } from '../../service/buscarBeneficiario.service';
import Swal from 'sweetalert2'
import { BeneficiarioAEditar, BeneficiarioImagen, BeneficiarioNuevoInterface, TipoDiscapacidad } from '../../../auth/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../service/validators.service';
import { GuardarBeneficiarioService } from '../../service/guardarBeneficiario.service';
import { ValidatorCurpService, ValidatorEditCurpService } from '../../service/validator.curp.service';
import { Beneficiario } from '../../../auth/interfaces/beneficiario-table.interface';
import { TiposSangreService } from '../../../auth/services/tiposSangre.service';
import { TiposSangre } from '../../../auth/interfaces/tipos-sangre';
import { Municipio } from '../../../auth/interfaces/municipio.interface';
import { MunicipiosService } from '../../../auth/services/municipios.service';
import { Localidades } from '../../../auth/interfaces/localidades.interface';
import { LocalidadesService } from '../../../auth/services/localidades.service';
import { TipoDiscapacidadService } from '../../../auth/services/tipoDiscapacidad.service';
import { ActualizarBeneneficiarioService } from '../../service/actualizarBeneneficiario.service';

@Component({
  selector: 'app-usuario-page',
  templateUrl: './usuario-page.component.html',
  styleUrl: './usuario-page.css'
})
export class UsuarioPageComponent implements OnInit {
  private router = inject(Router);

  public beneficiario?: BeneficiarioAEditar
  isSubmitting: boolean = false;
  tiposSangre: TiposSangre[] = [];
  municipios: Municipio[] = [];
  localidades: Localidades[] = [];
  tiposDiscapacidad: TipoDiscapacidad[] = [];
  idBeneficiarioActual: string = '';
  isLoading = true; // Variable para controlar la visibilidad del loader
  selectedImage: string | ArrayBuffer | null = null; // Propiedad para almacenar la URL de la imagen
  imagenSeleccionada: File | null = null;


  public formActualizarBeneficiario: FormGroup = this.fb.group({
    nombreBeneficiario: ['', [Validators.required]],
    apellidPaternoBeneficiario: ['', [Validators.required]],
    apellidoMaternoBeneficiario: ['', [Validators.required]],
    idMunicipioBeneficiario: ['', [Validators.required]],
    idLocalidadBeneficiario: ['', [Validators.required]],
    direccionBeneficiario: ['', [Validators.required]],
    tipoSangreBeneficiario: ['', [Validators.required]],
    alergiasBeneficiario: ['', [Validators.required]],
    telefonoEmergenciaBeneficiario: ['', [Validators.required]],
    comentariosBeneficiario: ['', [Validators.required]],
    idTipoDiscapacidadBeneficiario: ['', [Validators.required]],
  })

  public formActualizarFotografiaBeneficiario: FormGroup = this.fb.group({
    imagenBeneficiario: ['', [Validators.required]],
  })

  public formActualizarCurpBeneficiario: FormGroup = this.fb.group({
    curpBeneficiarioEditar: ['', [Validators.required, Validators.pattern(this.validatorsService.curpPattern)],
      [new ValidatorEditCurpService(this.activatedRoute.snapshot.paramMap.get('id'))]],
  })

  public formActualizarDatosContacto: FormGroup = this.fb.group({
    nombreContactoBeneficiarioEditar: ['', [Validators.required]],
    telefonoContactoBeneficiarioEditar: ['', [Validators.required]],
  })


  isValiedField(campo: string): boolean | null {
    return this.validatorsService.isValiedField(this.formActualizarBeneficiario, campo)
  }
  isValiedFieldImage(campo: string): boolean | null {
    return this.validatorsService.isValiedField(this.formActualizarFotografiaBeneficiario, campo)
  }

  isValiedCurp(campo: string): boolean | null {
    return this.validatorsService.isValiedField(this.formActualizarCurpBeneficiario, campo)
  }

  isValiedContacto(campo: string): boolean | null {
    return this.validatorsService.isValiedField(this.formActualizarDatosContacto, campo)
  }

  onValidate() {
    if (this.formActualizarBeneficiario.invalid) {
      this.formActualizarBeneficiario.markAllAsTouched();
      return;
    }
    else {
      this.isSubmitting = true; // Deshabilita el botón al iniciar el envío
      const datosBeneficiario: BeneficiarioNuevoInterface = {
        'nombre': this.formActualizarBeneficiario.value.nombreBeneficiario,
        'apellido_paterno': this.formActualizarBeneficiario.value.apellidPaternoBeneficiario,
        'apellido_materno': this.formActualizarBeneficiario.value.apellidoMaternoBeneficiario,
        'id_municipio': this.formActualizarBeneficiario.value.idMunicipioBeneficiario,
        'id_localidad': this.formActualizarBeneficiario.value.idLocalidadBeneficiario,
        'direccion': this.formActualizarBeneficiario.value.direccionBeneficiario,
        'tipo_sangre': this.formActualizarBeneficiario.value.tipoSangreBeneficiario,
        'alergias': this.formActualizarBeneficiario.value.alergiasBeneficiario,
        'telefono_emergencia': this.formActualizarBeneficiario.value.telefonoEmergenciaBeneficiario,
        'comentarios': this.formActualizarBeneficiario.value.comentariosBeneficiario,
        'id_discapacidad': this.formActualizarBeneficiario.value.idTipoDiscapacidadBeneficiario,
        'url_fotografia': '',
      };

      this.actualizarBeneneficiarioService.actualizarBeneficiario(datosBeneficiario, this.idBeneficiarioActual)
        .subscribe({
          next: (respuesta) => {
            if (respuesta.error != true) {
              this.beneficiario = respuesta.data;
              Swal.fire({
                title: "Correcto",
                text: "Se actualizó el usuario correctamente",
                icon: "success"
              }).then(() => {
                this.isSubmitting = false; // Habilita el botón después del envío
              });
            }
            else {
              this.isSubmitting = false; // Habilita el botón si hay un error
              this.isLoading = false;
              Swal.fire('Error', 'Error al actualizar verifique sus datos' || 'Error desconocido', 'error');
            }

          },
          error: (message) => {
            Swal.fire('Error', message.error, 'error');
            this.isSubmitting = false; // Habilita el botón si hay un error
          }
        });
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private buscarBeneficiarioService: BuscarBeneficiarioService,
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private guardarBeneficiarioService: GuardarBeneficiarioService,
    private TiposSangreService: TiposSangreService,
    private municipiosService: MunicipiosService,
    private localidadesService: LocalidadesService,
    private tipoDiscapacidadService: TipoDiscapacidadService,
    private actualizarBeneneficiarioService: ActualizarBeneneficiarioService,

  ) { }


  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(({ id }) => {
        this.idBeneficiarioActual = id;
        this.buscarBeneficiarioService.obtenerDatosBenficiarioById(id)
          .subscribe(dataUsuario => {
            if (dataUsuario != null) {
              this.beneficiario = dataUsuario.datos_beneficiario;
              const prefilledData = {
                nombreBeneficiario: dataUsuario.datos_beneficiario.nombre,
                apellidPaternoBeneficiario: dataUsuario.datos_beneficiario.apellido_paterno,
                apellidoMaternoBeneficiario: dataUsuario.datos_beneficiario.apellido_materno,
                curpBeneficiario: dataUsuario.datos_beneficiario.curp,
                idMunicipioBeneficiario: dataUsuario.datos_beneficiario.id_municipio,
                idLocalidadBeneficiario: dataUsuario.datos_beneficiario.id_localidad,
                direccionBeneficiario: dataUsuario.datos_beneficiario.direccion,
                tipoSangreBeneficiario: dataUsuario.datos_beneficiario.tipo_sangre,
                alergiasBeneficiario: dataUsuario.datos_beneficiario.alergias,
                telefonoEmergenciaBeneficiario: dataUsuario.datos_beneficiario.telefono_emergencia,
                comentariosBeneficiario: dataUsuario.datos_beneficiario.comentarios,
                idTipoDiscapacidadBeneficiario: dataUsuario.datos_beneficiario.id_tipo_discapacidad
              };

              this.obtener_localidades_por_municipio_iniciales(dataUsuario.datos_beneficiario.id_municipio)
              this.formActualizarBeneficiario.patchValue(prefilledData);
              const dataCurp = {
                curpBeneficiarioEditar: dataUsuario.datos_beneficiario.curp,
              };
              this.formActualizarCurpBeneficiario.patchValue(dataCurp);

              const dataContacto = {
                nombreContactoBeneficiarioEditar: dataUsuario.datos_beneficiario.nombre_contacto_emergencia,
                telefonoContactoBeneficiarioEditar: dataUsuario.datos_beneficiario.telefono_contacto_emergencia,
              };
              console.log(dataContacto);
              this.formActualizarDatosContacto.patchValue(dataContacto);


            } else {
              Swal.fire({
                title: "Correcto",
                text: "Se registró el usuario correctamente",
                icon: "success"
              }).then(() => {
                return this.router.navigateByUrl('')
              });
            }
          });
      });

    this.TiposSangreService.obtener_listado_alergias().subscribe(listadoTiposSangre => {
      this.tiposSangre = listadoTiposSangre.tipos_sangre;
    })

    this.municipiosService.obtener_listado_munciipios().subscribe(listadoMunicipios => {
      this.municipios = listadoMunicipios.municipios;
    })

    this.tipoDiscapacidadService.obtener_listado_dicapacidades().subscribe(listadoDiscapacidad => {
      this.tiposDiscapacidad = listadoDiscapacidad.tipos_discapacidad;
    })


    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  obtener_localidades_por_municipio(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const idMunicipio = selectElement.value;
    this.localidadesService.obtener_localidades_por_municipio(idMunicipio).subscribe(listadoLocalidades => {
      this.localidades = listadoLocalidades.localidades;
    })
  }

  obtener_localidades_por_municipio_iniciales(idMunicipio: string) {
    this.localidadesService.obtener_localidades_por_municipio(idMunicipio).subscribe(listadoLocalidades => {
      this.localidades = listadoLocalidades.localidades;
    })
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
              this.formActualizarFotografiaBeneficiario.setErrors({ invalid: true });
              Swal.fire('Error', 'La imagen debe medir 200px de ancho por 300px de alto.', 'error');
              this.selectedImage = null; // Limpia la imagen seleccionada si no cumple con las dimensiones
            }
          };

          // Manejo de errores en la carga de la imagen
          img.onerror = () => {
            this.formActualizarFotografiaBeneficiario.setErrors({ invalid: true });
            Swal.fire('Error', 'No se pudo cargar la imagen para validar las dimensiones.', 'error');
            this.selectedImage = null; // Limpia la imagen seleccionada si no se pudo cargar
          };
        } else {
          this.formActualizarFotografiaBeneficiario.setErrors({ invalid: true });
          this.selectedImage = null; // Limpia la imagen seleccionada si no se pudo cargar
          Swal.fire('Error', "La imagen no puede pesar más de 1MB.", 'error');
        }
      } else {
        Swal.fire('Error', "Solo se aceptan imágenes en formato JPG o PNG.", 'error');
        this.formActualizarFotografiaBeneficiario.setErrors({ invalid: true });
        this.selectedImage = null; // Limpia la imagen seleccionada si no se pudo cargar
      }
    }
  }

  onSubirImagen() {
    if (this.formActualizarFotografiaBeneficiario.invalid) {
      this.formActualizarFotografiaBeneficiario.markAllAsTouched();
      return;
    }
    else {
      this.isSubmitting = true; // Deshabilita el botón al iniciar el envío
      const imagenBeneficiario: BeneficiarioImagen = {
        'url_fotografia': '',
      };

      this.actualizarBeneneficiarioService.actualizarImagenBeneficiario(this.imagenSeleccionada, this.idBeneficiarioActual)
        .subscribe({
          next: (respuesta) => {
            if (respuesta.error != true) {
              this.beneficiario = respuesta.data;
              Swal.fire({
                title: "Correcto",
                text: "Se actualizó el usuario correctamente",
                icon: "success"
              }).then(() => {
                this.isSubmitting = false; // Habilita el botón después del envío
              });
            }
            else {
              this.isSubmitting = false; // Habilita el botón si hay un error
              this.isLoading = false;
              Swal.fire('Error', 'Error al actualizar verifique sus datos' || 'Error desconocido', 'error');
            }

          },
          error: (message) => {
            Swal.fire('Error', message.error, 'error');
            this.isSubmitting = false; // Habilita el botón si hay un error
          }
        });
    }
  }

  onActualizarCurp() {
    if (this.formActualizarCurpBeneficiario.invalid) {
      this.formActualizarCurpBeneficiario.markAllAsTouched();
      return;
    }
    else {
      this.isSubmitting = true; // Deshabilita el botón al iniciar el envío
      const curp = this.formActualizarCurpBeneficiario.value.curpBeneficiarioEditar;
      this.actualizarBeneneficiarioService.actualizarCurpBeneficiario(curp, this.idBeneficiarioActual)
        .subscribe({
          next: (respuesta) => {
            if (respuesta.error != true) {
              this.beneficiario = respuesta.data;
              Swal.fire({
                title: "Correcto",
                text: "Se actualizó el usuario correctamente",
                icon: "success"
              }).then(() => {
                this.isSubmitting = false; // Habilita el botón después del envío
              });
            }
            else {
              this.isSubmitting = false; // Habilita el botón si hay un error
              this.isLoading = false;
              Swal.fire('Error', 'Error al actualizar verifique sus datos' || 'Error desconocido', 'error');
            }
          },
          error: (message) => {
            Swal.fire('Error', message.error, 'error');
            this.isSubmitting = false; // Habilita el botón si hay un error
          }
        });
    }
  }

  onActualizarDatosContacto() {
    if (this.formActualizarDatosContacto.invalid) {
      this.formActualizarDatosContacto.markAllAsTouched();
      return;
    }
    else {
      this.isSubmitting = true; // Deshabilita el botón al iniciar el envío
      this.isSubmitting = true; // Deshabilita el botón al iniciar el envío
      const datosContactoBeneficiario = {
        'nombre_contacto_emergencia': this.formActualizarDatosContacto.value.nombreContactoBeneficiarioEditar,
        'telefono_contacto_emergencia': this.formActualizarDatosContacto.value.telefonoContactoBeneficiarioEditar,
      };

      this.actualizarBeneneficiarioService.actualizarDatosContactoBeneficiario(datosContactoBeneficiario, this.idBeneficiarioActual)
        .subscribe({
          next: (respuesta) => {
            if (respuesta.error != true) {
              this.beneficiario = respuesta.data;
              Swal.fire({
                title: "Correcto",
                text: "Se actualizó el usuario correctamente",
                icon: "success"
              }).then(() => {
                this.isSubmitting = false; // Habilita el botón después del envío
              });
            }
            else {
              this.isSubmitting = false; // Habilita el botón si hay un error
              this.isLoading = false;
              Swal.fire('Error', 'Error al actualizar verifique sus datos' || 'Error desconocido', 'error');
            }
          },
          error: (message) => {
            Swal.fire('Error', message.error, 'error');
            this.isSubmitting = false; // Habilita el botón si hay un error
          }
        });

    }
  }
}
