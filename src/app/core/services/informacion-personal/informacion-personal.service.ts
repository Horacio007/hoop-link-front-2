import { Injectable } from '@angular/core';

import { WebApiService } from '../web-api/web-api.service';
import { Observable, catchError, throwError } from 'rxjs';

import { WebApiConstants } from '../../constants/web-api/web-api.constants';
import { IResponse } from '../../interfaces/response/response.interface';
import { IVideoInformacionPersonalResponse } from '../../../shared/interfaces/video/videos-response.interface';
import { HttpEvent } from '@angular/common/http';

import { LoggerService } from '../../services/logger/logger.service';
import { LogLevel } from '../../enums';
import { IInformacinPersonal } from '../../../shared/interfaces/informacion-personal';

@Injectable({
  providedIn: 'root'
})
export class InformacionPersonalService {

//#region Propiedades
  private readonly _contextLog = 'InformacionPersonalService';
//#endregion

//#region Constructor
  constructor(
    private readonly _webApiService:WebApiService,
    private readonly _logger: LoggerService
  ) { }
//#endregion

//#region Servicios
  public save(datos: FormData): Observable<IResponse<any>> {
    const url: string = WebApiConstants.informacion_personal.save;
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> save`, 'Guardando información personal.', { endpoint: url, datos });

    return this._webApiService.post<IResponse<any>>(url, datos, true).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public getInformacionPersonal(): Observable<IResponse<IInformacinPersonal | undefined>> {
    const url: string = WebApiConstants.informacion_personal.getInformacion

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getInformacionPersonal`, 'Solicitando información personal.', { endpoint: url });

    return this._webApiService.get<IResponse<IInformacinPersonal | undefined>>(url, true).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public getInformacionPersonalById(informacionPersonalId: number): Observable<IResponse<IInformacinPersonal | undefined>> {
    const url: string = WebApiConstants.informacion_personal.getInformacionById(informacionPersonalId);

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getInformacionPersonal`, 'Solicitando información personal.', { endpoint: url });

    return this._webApiService.get<IResponse<IInformacinPersonal | undefined>>(url, true).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public uploadVideos(tipo:string, id:string, file: FormData): Observable<HttpEvent<IResponse<IVideoInformacionPersonalResponse>>> {
    const url: string = WebApiConstants.informacion_personal.uploadVideos(tipo, id);

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> uploadVideos`, 'Subiendo video', { endpoint: url, tipo, id, file });

    return this._webApiService.post<IResponse<IVideoInformacionPersonalResponse>>(url, file, true, { reportProgress: true, observe: 'events' }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public getTotalVistasPerfil(): Observable<IResponse<number | undefined>> {
    const url: string = WebApiConstants.informacion_personal.getTotalVistasPerfil;

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getTotalVistasPerfil`, 'Solicitando vistas de perfil.', { endpoint: url });

    return this._webApiService.get<IResponse<number | undefined>>(url, true).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
//#endregion

}
