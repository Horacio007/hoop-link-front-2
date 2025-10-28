import { Injectable } from '@angular/core';
import { WebApiService } from '../../../core/services/web-api/web-api.service';
import { WebApiConstants } from '../../../core/constants/web-api/web-api.constants';
import { ICatalogo } from '../../interfaces/catalogo/catalogo.interface';
import { map, Observable } from 'rxjs';

import { LoggerService } from '../../../core/services/logger/logger.service';
import { LogLevel } from '../../../core/enums';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

//#region Propiedades
  public AllTipoUsuario: Array<ICatalogo> = [];

  private readonly _contextLog = 'CatalogoService';
 //#endregion Propiedades

//#region Constructor
  constructor(
    private readonly webApiService:WebApiService,
    private readonly _logger: LoggerService
  ) { }

//#endregion

//#region Servicios
  public getAllTipoUsuario(): Observable<ICatalogo[]> {
    const url: string = WebApiConstants.catalogo.getAllTipoUsuario;

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getAllTipoUsuario`, 'Iniciando llamada al API.', { endpoint: url });

    return this.webApiService.get<ICatalogo[]>(url);
  }

  public getAllEstado(): Observable<ICatalogo[]> {
    const url: string = WebApiConstants.catalogo.getAllEstado;

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getAllEstado`, 'Iniciando llamada al API.', { endpoint: url });

    return this.webApiService.get<ICatalogo[]>(url);
  }

  public getAllMunicipioByEstado(id:string): Observable<ICatalogo[]> {
    const url: string = WebApiConstants.catalogo.getAllMunicipioByEstado(id);

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getAllMunicipioByEstado`, 'Iniciando llamada al API.', { endpoint: url, estadoId: id });

    return this.webApiService.get<ICatalogo[]>(url);
  }

  public getAllEstatusBusquedaJugador(): Observable<ICatalogo[]> {
    const url: string = WebApiConstants.catalogo.getAllEstatusBusquedaJugador;

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getAllEstatusBusquedaJugador`, 'Iniciando llamada al API.', { endpoint: url });

    return this.webApiService.get<ICatalogo[]>(url);
  }

   public getAllPosicionJugador(): Observable<ICatalogo[]> {
    const url: string = WebApiConstants.catalogo.getAllPosicionJugador;

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> getAllPosicionJugador`, 'Iniciando llamada al API.', { endpoint: url });

    return this.webApiService.get<ICatalogo[]>(url);
  }
//#endregion
}
