import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, delay, of, map } from 'rxjs';

import { FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VerificacionRespuetaCurp } from '../../auth/interfaces';

@Injectable({
  providedIn: 'root'
})


export class ValidatorCurpService implements AsyncValidator {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  validate(curp: AbstractControl): Observable<ValidationErrors | null> {
    const curpEnviar = curp.value;
    const url = `${this.baseUrl}/generales/validar_curp_duplicado`
    const body = { curp: curpEnviar };
    const token = localStorage.getItem('token');
    if (!token) return of({ estatus: true });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
    });
    return this.http.post<VerificacionRespuetaCurp>(url, body, { headers })
      .pipe(
        map(resp => {
          return (resp.estatus != null)
            ? null
            : { estatus: true }
        })
      )
  }
}

export class ValidatorEditCurpService implements AsyncValidator {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  constructor(private idBeneficiario: any) { }



  //  this.activatedRoute.params
  validate(curp: AbstractControl): Observable<ValidationErrors | null> {
    const curpEnviar = curp.value;
    const url = `${this.baseUrl}/beneficiarios/validar_edicion_curp`
    const body = {
      curp: curpEnviar,
      id_beneficiario: this.idBeneficiario // Úsalo aquí
    };
    const token = localStorage.getItem('token');
    if (!token) return of({ estatus: true });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
    });
    return this.http.post<VerificacionRespuetaCurp>(url, body, { headers })
      .pipe(
        map(resp => {
          return (resp.estatus != null)
            ? null
            : { estatus: true }
        })
      )
  }
}

