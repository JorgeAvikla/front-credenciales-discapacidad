import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthStatus, CheckTokenResponse, DatosUsuario, LoginResponse } from '../interfaces';
import { error } from 'console';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private _currentUser = signal<DatosUsuario | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //!  FUERA DEL SERVICIO
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe()
  }

  private setAuthentication(datos_usuario: DatosUsuario, token: string): boolean {
    this._currentUser.set(datos_usuario);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  login(usuario: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`
    const body = { usuario, password };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map(({ datos_usuario, token }) => this.setAuthentication(datos_usuario, token)),
        catchError(err => throwError(() => err.error.messages)
        )
      );
  }

  // VERFICIAR TOKEN



  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/verificar_token`;
    const token = localStorage.getItem('token');
    if (!token) return of(false);
    const headers = new HttpHeaders()
      .set('Authorization', token);
    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({ usuario, token }) => this.setAuthentication(usuario, token)),
        catchError((error) => {
          console.log(error);
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
