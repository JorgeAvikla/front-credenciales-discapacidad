import { Injectable, inject } from '@angular/core';
// import { BeneficiarioNuevoInterface } from '../../auth/interfaces/beneficiario-nuevo.interface';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardarBeneficiarioService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  constructor() { }
  guardarBeneficiario(beneficiario: any, imagen: any): Observable<boolean | any> {
    const url = `${this.baseUrl}/beneficiarios/registro_beneficiario`
    const formulario = new FormData();
    formulario.append('nombre', beneficiario.get('nombreBeneficiario')?.value);
    formulario.append('apellido_paterno', beneficiario.get('apellidPaternoBeneficiario')?.value);
    formulario.append('apellido_materno', beneficiario.get('apellidoMaternoBeneficiario')?.value);
    formulario.append('curp', beneficiario.get('curpBeneficiario')?.value);
    formulario.append('id_municipio', beneficiario.get('idMunicipioBeneficiario')?.value);
    formulario.append('id_localidad', beneficiario.get('idLocalidadBeneficiario')?.value);
    formulario.append('direccion', beneficiario.get('direccionBeneficiario')?.value);
    formulario.append('tipo_sangre', beneficiario.get('tipoSangreBeneficiario')?.value);
    formulario.append('alergias', beneficiario.get('alergiasBeneficiario')?.value);
    formulario.append('telefono_emergencia', beneficiario.get('telefonoEmergenciaBeneficiario')?.value);
    formulario.append('comentarios', beneficiario.get('comentariosBeneficiario')?.value);
    formulario.append('id_discapacidad', beneficiario.get('idTipoDiscapacidadBeneficiario')?.value);
    formulario.append('imagen_beneficiario', imagen);
    const body = formulario;
    const token = localStorage.getItem('token');
    if (!token) return of({ estatus: true });
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': token,
    });
    return this.http.post(url, body, { headers })
      .pipe(
        map(resp => {
          return resp;
        })
      )
  }
}
