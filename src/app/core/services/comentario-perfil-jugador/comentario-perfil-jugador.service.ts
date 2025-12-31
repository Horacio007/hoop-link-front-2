import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import { WebApiService } from '../web-api/web-api.service';
import { IComentarioPerfil, ISaveComentarioPerfil } from 'src/app/features/jugador/interfaces/comentario-perfil.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { WebApiConstants } from '../../constants/web-api/web-api.constants';
import { LogLevel } from '../../enums';
import { IResponse } from '../../interfaces/response/response.interface';

@Injectable({
  providedIn: 'root'
})
export class ComentarioPerfilJugadorService {
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
  public save(comentarioSave: ISaveComentarioPerfil): Observable<IResponse<any>> {
    const url: string = WebApiConstants.comentario.save;
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> save`, 'Guardando comentario.', { endpoint: url, comentarioSave });

    return this._webApiService.post<IResponse<any>>(url, comentarioSave, true).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public getAllComentariosByInformacionPersonalId(informacionPersonalId: number): Observable<IResponse<IComentarioPerfil[] | undefined>> {
      const url: string = WebApiConstants.comentario.getAllComentarioByInformacionPersonalId(informacionPersonalId);

      this._logger.log(LogLevel.Debug, `${this._contextLog} >> getAllComentariosByInformacionPersonalId`, 'Solicitando comentarios del perfil.', { endpoint: url });

      return this._webApiService.get<IResponse<IComentarioPerfil[] | undefined>>(url, true).pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
    }
//#endregion
}
