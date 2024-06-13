import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ListaLocalidadesPorMunicipio } from '../interfaces/localidades-por-municipio.response.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {


  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  obtener_localidades_por_municipio(id_municipio: string): Observable<any> {
    const url = `${this.baseUrl}/generales/obtener_localidades_por_municipio`
    const body = { id_municipio };
    const token = localStorage.getItem('token');
    if (!token) return of(false);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token,
    });
    return this.http.post<ListaLocalidadesPorMunicipio>(url, body, { headers })
  }

  constructor() { }

}
