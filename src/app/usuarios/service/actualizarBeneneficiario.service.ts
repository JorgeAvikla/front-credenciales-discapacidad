import { Injectable, inject } from '@angular/core';
import { BeneficiarioNuevoInterface } from '../../auth/interfaces/beneficiario-nuevo.interface';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ActualizarBeneneficiarioService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);


  actualizarBeneficiario(beneficiario: BeneficiarioNuevoInterface, idBeneficiario: string): Observable<boolean | any> {
    const url = `${this.baseUrl}/beneficiarios/actualizar_beneficiario`
    const body = {
      'nombre': beneficiario.nombre,
      'apellido_paterno': beneficiario.apellido_paterno,
      'apellido_materno': beneficiario.apellido_materno,
      'id_municipio': beneficiario.id_municipio,
      'id_localidad': beneficiario.id_localidad,
      'direccion': beneficiario.direccion,
      'tipo_sangre': beneficiario.tipo_sangre,
      'alergias': beneficiario.alergias,
      'telefono_emergencia': beneficiario.telefono_emergencia,
      'comentarios': beneficiario.comentarios,
      'id_discapacidad': beneficiario.id_discapacidad,
      'id_beneficiario': idBeneficiario,
    };
    const token = localStorage.getItem('token');
    if (!token) return of({ estatus: true });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
    });
    return this.http.put(url, body, { headers })
      .pipe(
        map(resp => {
          return resp
        })
      )

  }

  actualizarImagenBeneficiario(imagen: any, idBeneficiario: string): Observable<boolean | any> {
    const url = `${this.baseUrl}/beneficiarios/actualizar_imagen_beneficiario`
    const formulario = new FormData();
    formulario.append('imagen_beneficiario', imagen);
    formulario.append('id_beneficiario', idBeneficiario);
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

  actualizarCurpBeneficiario(curp: any, idBeneficiario: string): Observable<boolean | any> {
    const url = `${this.baseUrl}/beneficiarios/actualizar_curp`
    const body = {
      'curp': curp,
      'id_beneficiario': idBeneficiario,
    };
    const token = localStorage.getItem('token');
    if (!token) return of({ estatus: true });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
    });
    return this.http.put(url, body, { headers })
      .pipe(
        map(resp => {
          return resp
        })
      )

  }
  constructor() { }

}
