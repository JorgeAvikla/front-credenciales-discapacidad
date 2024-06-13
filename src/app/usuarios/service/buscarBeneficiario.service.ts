import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { RespuestaBusquedaBeneficiarios } from '../../auth/interfaces/repuesta-busqueda-beneficiarios';

@Injectable({
  providedIn: 'root'
})
export class BuscarBeneficiarioService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  public obtenerDatosBenficiarioById(id: string): Observable<RespuestaBusquedaBeneficiarios | any> {
    const url = `${this.baseUrl}/beneficiarios/obtener_datos_edicion_beneficiario/${id}`;
    const token = localStorage.getItem('token');
    if (!token) return of(null);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
    });
    return this.http.get(url, { headers })
      .pipe(
        map(resp => {
          return (resp)
        })
      )
  }
  constructor() { }

}
