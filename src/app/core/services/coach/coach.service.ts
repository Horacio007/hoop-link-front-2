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
  private readonly KEY = 'coach_listado_state';
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

  public saveVisitaPerfil(informacionPersonalId: number): Observable<IResponse<void>> {
    const url: string = WebApiConstants.coach.saveVistaPerfil(informacionPersonalId)

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> saveVisitaPerfil`, 'Almacenando vista en perfil.', { endpoint: url });

    return this._webApiService.post<IResponse<void>>(url, {}, true).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public saveFavoritoPerfil(informacionPersonalId: number): Observable<IResponse<void>> {
    const url: string = WebApiConstants.coach.saveFavoritoPerfil(informacionPersonalId)

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> saveFavoritoPerfil`, 'Almacenando favorito en perfil.', { endpoint: url });

    return this._webApiService.post<IResponse<void>>(url, {}, true).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public getAllJugadoresFavoritos(): Observable<IResponse<IListadoJugadores[] | undefined>> {
    const url: string = WebApiConstants.coach.getAllJugadoresFavoritos;

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getAllJugadoresFavoritos`, 'Solicitando todos los jugdadores favoritos.', { endpoint: url });

    return this._webApiService.get<IResponse<IListadoJugadores[] | undefined>>(url, true).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public getTotalFavoritosPerfil(): Observable<IResponse<number | undefined>> {
    const url: string = WebApiConstants.coach.getTotalFavoritosPerfil;

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getTotalFavoritosPerfil`, 'Solicitando favoritos de perfil.', { endpoint: url });

    return this._webApiService.get<IResponse<number | undefined>>(url, true).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
//#endregion

//#region Servicios Filtros

  private getKey(vistaDeFavoritos: boolean): string {
    return vistaDeFavoritos
      ? 'coach_listado_favoritos_state'
      : 'coach_listado_state';
  }

  save(state: any, vistaDeFavoritos: boolean) {
    sessionStorage.setItem(
      this.getKey(vistaDeFavoritos),
      JSON.stringify(state)
    );
  }

  load(vistaDeFavoritos: boolean): any | null {
    const data = sessionStorage.getItem(this.getKey(vistaDeFavoritos));
    return data ? JSON.parse(data) : null;
  }

  clear(vistaDeFavoritos: boolean) {
    sessionStorage.removeItem(this.getKey(vistaDeFavoritos));
  }


//#endregion

}
