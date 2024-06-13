import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ListadoTiposSangre } from '../interfaces/tipos-sangre.response.interface';
@Injectable({
  providedIn: 'root'
})
export class TiposSangreService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  obtener_listado_alergias(): Observable<any> {
    const url = `${this.baseUrl}/generales/obtener_listado_alergias`
    const token = localStorage.getItem('token');
    if (!token) return of(false);
    const headers = new HttpHeaders()
      .set('Authorization', token);
    return this.http.get<ListadoTiposSangre>(url, { headers })
  }
  constructor() { }

}
