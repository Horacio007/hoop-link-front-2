import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { LoggerService } from '../../services/logger/logger.service';
import { LogLevel } from '../../enums';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

//#region Propiedades
  private readonly _contextLog = 'WebApiService';
//#endregion

//#region Constructor
  constructor(private _http: HttpClient,  private readonly _logger: LoggerService) {}
//#endregion

//#region Servicios
  // Método GET (con opción de autenticación)
  get<T>(endpoint: string, authRequired: boolean = false): Observable<T> {
    const fullUrl = `${environment.apiUrl}/${endpoint}`;

    this._logger.log(
      LogLevel.Debug,
      `${this._contextLog} >> GET`,
      `Realizando solicitud GET a ${endpoint}`,
      { endpoint: fullUrl, authRequired }
    );

    return this._http.get<T>(fullUrl, this.getOptions(authRequired));
  }

  // Método POST
  post<T>(
    endpoint: string,
    data: any,
    authRequired?: boolean,
    extraOptions?: { reportProgress?: boolean; observe?: 'body' }
  ): Observable<T>;

  post<T>(
    endpoint: string,
    data: any,
    authRequired: boolean,
    extraOptions: { reportProgress?: boolean; observe: 'events' }
  ): Observable<HttpEvent<T>>;

  post<T>(
    endpoint: string,
    data: any,
    authRequired: boolean = false,
    extraOptions: { reportProgress?: boolean; observe?: 'body' | 'events' } = {}
  ): Observable<T> | Observable<HttpEvent<T>> {
    const baseOptions = this.getOptions(authRequired);
    const fullUrl = `${environment.apiUrl}/${endpoint}`;

    // Crea un nuevo objeto para las opciones HTTP sin mezclar tipos
    const httpOptions: any = { ...baseOptions };

    if (extraOptions.observe === 'events') {
      httpOptions.observe = 'events';
      httpOptions.reportProgress = extraOptions.reportProgress ?? true;
    } else {
      // Por defecto o si observe es 'body' o undefined
      httpOptions.observe = 'body';
      httpOptions.reportProgress = extraOptions.reportProgress ?? false;
    }

    this._logger.log(
      LogLevel.Debug,
      `${this._contextLog} >> POST`,
      `Realizando solicitud POST a ${endpoint}`,
      { endpoint: fullUrl, authRequired, observe: httpOptions.observe }
    );

    return this._http.post<T>(fullUrl, data, httpOptions);
  }



  // Método PUT
  put<T>(endpoint: string, data: any, authRequired: boolean = false): Observable<T> {
    const fullUrl = `${environment.apiUrl}/${endpoint}`;

    this._logger.log(
      LogLevel.Debug,
      `${this._contextLog} >> PUT`,
      `Realizando solicitud PUT a ${endpoint}`,
      { authRequired }
    );

    return this._http.put<T>(`${environment.apiUrl}/${endpoint}`, data, this.getOptions(authRequired));
  }

  // Método DELETE
  delete<T>(endpoint: string, authRequired: boolean = false): Observable<T> {
    const fullUrl = `${environment.apiUrl}/${endpoint}`;

    this._logger.log(
      LogLevel.Debug,
      `${this._contextLog} >> DELETE`,
      `Realizando solicitud DELETE a ${endpoint}`,
      { endpoint: fullUrl, authRequired }
    );

    return this._http.delete<T>(fullUrl, this.getOptions(authRequired));
  }

  // Método privado para construir los headers
  private getOptions(authRequired: boolean): { headers?: HttpHeaders } {
     let headers = new HttpHeaders();

    if (authRequired) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);

         this._logger.log(
          LogLevel.Debug,
          `${this._contextLog} >> getOptions`,
          'Encabezado Authorization agregado'
        );
      } else {
        this._logger.log(
          LogLevel.Debug,
          `${this._contextLog} >> getOptions`,
          'No se encontró token en localStorage'
        );
      }
    }

    return { headers };
  }
//#endregion
}
