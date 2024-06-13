import { FormGroup } from '@angular/forms';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { VerificacionRespuetaCurp } from '../../auth/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  public curpPattern: string = "^[A-Z]{4}[0-9]{6}[HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}([A-Z]{2})?([0-9]{2})?$";

  public isValiedField(form: FormGroup, field: string) {
    return form.controls[field].errors
      && form.controls[field].touched
  }

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  public validarCurpDuplicado(curp: string): Observable<VerificacionRespuetaCurp> {
    const url = `${this.baseUrl}/generales/validar_curp_duplicado`
    const body = { curp };
    const token = localStorage.getItem('token');
    if (!token) return of({ estatus: false });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
    });
    return this.http.post<VerificacionRespuetaCurp>(url, body, { headers })
  }
}
