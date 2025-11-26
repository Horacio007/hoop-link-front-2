import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import { WebApiService } from '../web-api/web-api.service';
import { Observable, catchError, throwError } from 'rxjs';
import { IInformacinPersonal } from 'src/app/shared/interfaces/informacion-personal';
import { WebApiConstants } from '../../constants/web-api/web-api.constants';
import { LogLevel } from '../../enums';
import { IResponse } from '../../interfaces/response/response.interface';
import { IListadoJugadores } from 'src/app/shared/interfaces/coach/listado-jugadores.interface';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
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
  public getAllJugadores(): Observable<IResponse<IListadoJugadores[] | undefined>> {
    const url: string = WebApiConstants.coach.getAllJugadores

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getAllJugadores`, 'Solicitando todos los jugdadores.', { endpoint: url });

    return this._webApiService.get<IResponse<IListadoJugadores[] | undefined>>(url, true).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
//#endregion

}
