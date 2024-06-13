import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthStatus, Beneficiarios } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class BeneficiariosService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  obtener_beneficiarios(): Observable<any> {
    const url = `${this.baseUrl}/beneficiarios/todos_los_beneficiarios`
    const token = localStorage.getItem('token');
    if (!token) return of(false);
    const headers = new HttpHeaders()
      .set('Authorization', token);
    return this.http.get<Beneficiarios>(url, { headers })
  }

  constructor() { }

}
