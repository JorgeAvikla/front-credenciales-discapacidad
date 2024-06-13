import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ListadoMunicipios } from '../interfaces/all-municipies.response.interface';

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {


  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  obtener_listado_munciipios(): Observable<any> {
    const url = `${this.baseUrl}/generales/obtener_municipios`
    const token = localStorage.getItem('token');
    if (!token) return of(false);
    const headers = new HttpHeaders()
      .set('Authorization', token);
    return this.http.get<ListadoMunicipios>(url, { headers })
  }

  constructor() { }

}
