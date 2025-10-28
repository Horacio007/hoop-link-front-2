import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';

import { Observable, of, throwError, combineLatest } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';

import { ILogin } from '../interfaces/login.interface';
import { IAuthUser } from '../interfaces/auth-user.interface';
import { IResponse } from '../../interfaces/response/response.interface';
import { ITokens } from '../interfaces';

import { AuthApiService } from './auth-api.service';
import { WebApiService } from '../../services/web-api/web-api.service';
import { LoggerService } from '../../services/logger/logger.service';

import { WebApiConstants } from '../../constants/web-api/web-api.constants';

import { LogLevel } from '../../enums';

@Injectable({ providedIn: 'root' })
export class AuthService {

//#region Propiedades
  private readonly _contextLog = 'AuthService';

  // 👇 Signals en lugar de BehaviorSubjects
  private readonly _user = signal<IAuthUser | null>(null);
  private readonly _authChecked = signal<boolean>(false);

  // Expuestos si necesitas leerlos en otras partes (readonly)
  public readonly user = this._user;
  public readonly authChecked = this._authChecked;

  // usados por el guard
  readonly user$ = toObservable(this.user);
  readonly authChecked$ = toObservable(this.authChecked);
//#endregion

//#region Constructor
  constructor(
    private readonly _authApi: AuthApiService,
    private readonly _webApiService: WebApiService,
    private readonly _router: Router,
    private readonly _logger: LoggerService
  ) {}
//#endregion

//#region Servicios
  /** 🔐 LOGIN */
  login(credenciales: ILogin): Observable<IAuthUser | null> {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> login`, 'Login iniciado', { username: credenciales.correo });

    return this._authApi.login(credenciales).pipe(
      map(res => res.data), // ⬅️ Extrae los tokens desde la respuesta
      tap(tokens => {
        if (!tokens) throw new Error('Respuesta sin tokens');
        localStorage.setItem('accessToken', tokens.token);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        this._logger.log(LogLevel.Info, `${this._contextLog} >> login`, 'Tokens guardados en localStorage');
      }),
      switchMap(() => this.checkAuth()),
      switchMap(() =>
        combineLatest([this.user$, this.authChecked$]).pipe(
          filter(([user, checked]) => !!user && checked),
          take(1),
          map(([user]) => user)
        )
      ),
      tap(user => {
        this._user.set(user);
        this._authChecked.set(true);
        this._logger.log(LogLevel.Info, `${this._contextLog} >> login`, 'Usuario autenticado correctamente', user);
      }),
      catchError(err => {
        this.clearTokens();
        this._user.set(null);
        this._authChecked.set(true);
        this._logger.log(LogLevel.Error, `${this._contextLog} >> login`, 'Error en login', err);
        return throwError(() => err);
      })
    );
  }

  /** 🚪 LOGOUT */
  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    this._logger.log(LogLevel.Info, `${this._contextLog} >> logout`, 'Logout iniciado');

    return this._authApi.logout(refreshToken ?? '').pipe(
      catchError((err) => {
        this._logger.log(LogLevel.Warn, `${this._contextLog} >> logout`, 'Error en logout, pero se continua', err);

        return of(null);
      }), // incluso si el backend falla
      tap(() => {
        this.clearTokens();
        this._user.set(null);
        this._authChecked.set(true);
        this._logger.log(LogLevel.Info, `${this._contextLog} >> logout`, 'Logout completado y navegación a /login');
        this._router.navigate(['/login']);
      })
    );
  }

  /** 👁️ Verificar usuario autenticado */
  checkAuth(): Observable<IAuthUser | null> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this._user.set(null);
      this._authChecked.set(true);
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> checkAuth`, 'No hay token, usuario no autenticado');
      return of(null);
    }

    return this._webApiService.get<IResponse<IAuthUser>>(WebApiConstants.auth.yopli, true).pipe(
      map(response => response.data ?? null),
      tap(user => {
        this._logger.log(LogLevel.Info, `${this._contextLog} >> checkAuth`, 'USUARIO CARGADO:', user)
        this._user.set(user);
        this._authChecked.set(true);
        this._logger.log(LogLevel.Info, `${this._contextLog} >> checkAuth`, 'Usuario cargado desde checkAuth', user);
      }),
      catchError(err => {
        this._logger.log(LogLevel.Warn, `${this._contextLog} >> checkAuth`, 'Token inválido o expirado:', err )
        this.clearTokens();
        this._user.set(null);
        this._authChecked.set(true);
        this._logger.log(LogLevel.Warn, `${this._contextLog} >> checkAuth`, 'Token inválido o expirado en checkAuth', err);
        return of(null);
      })
    );
  }

  /** 🔄 REFRESH TOKEN */
  refreshToken(): Observable<IAuthUser | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> refreshToken`, 'No hay refresh token disponible');

      return of(null);
    }

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> refreshToken`, 'Refresh token iniciado');

    return this._authApi.refreshToken(refreshToken).pipe(
      map(res => res.data), // ⬅️ extrae los tokens del IResponse
      tap(tokens => {
        if (!tokens) throw new Error('No se recibieron nuevos tokens');
        localStorage.setItem('accessToken', tokens.token);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        this._logger.log(LogLevel.Info, `${this._contextLog} >> refreshToken`, 'Refresh token exitoso, tokens actualizados');
      }),
      switchMap(() => this.checkAuth()),
      catchError(err => {
        this.clearTokens();
        this._user.set(null);
        this._authChecked.set(true);
        this._logger.log(LogLevel.Error, `${this._contextLog} >> refreshToken`, 'Error en refresh token', err);
        return of(null);
      })
    );
  }

  /** 🧹 Helpers */
  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }

  getUser(): IAuthUser | null {
    return this._user();
  }

  setUser(user: IAuthUser) {
    this._user.set(user);
  }

  setChecked(checked: boolean) {
    this._authChecked.set(checked);
  }

  /** Debug o endpoint manual */
  yopli(): Observable<IAuthUser | null> {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> yopli`, 'yopli llamado');

    return this._webApiService.get<IResponse<IAuthUser>>(WebApiConstants.auth.yopli, true).pipe(
      map(response => response.data ?? null),
      tap(user => {
        this._user.set(user)
        this._logger.log(LogLevel.Info, `${this._contextLog} >> yopli`, 'yop devolvió usuario', user);
      }),
      catchError(error => {
        this._logger.log(LogLevel.Error, `${this._contextLog} >> yopli`, 'yopli falló', error);
        return throwError(() => error);
      })
    );
  }
//#endregion

}
