import { Injectable } from '@angular/core';
import { IRecuperaContrasena, IRegistro } from '../../../shared/interfaces/usuario/registro.interface';
import { WebApiService } from '../web-api/web-api.service';
import { catchError, Observable, throwError } from 'rxjs';
import { WebApiConstants } from '../../constants/web-api/web-api.constants';

import { LoggerService } from '../../services/logger/logger.service';
import { LogLevel } from '../../enums';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

//#region Propiedades
  public esRegistro:boolean = false;
  public usuarioTokenValidado = false;

  private readonly _contextLog = 'UsuarioService';
//#endregion

//#region Constructor
  constructor(
    private readonly _webApiService:WebApiService,
    private readonly _logger:LoggerService
  ) { }
//#endregio

//#region Servicios
  public save(registroDTO:IRegistro): Observable<any> {
    const url: string = WebApiConstants.usuario.save;

    this._logger.log(
      LogLevel.Debug,
      `${this._contextLog} >> save`,
      'Enviando datos de registro al backend',
      { endpoint: url, registroDTO }
    );

    return this._webApiService.post<IRegistro>(url, registroDTO).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public validaToken(token:string): Observable<any> {
    const url: string = WebApiConstants.usuario.validaToken(token);

      this._logger.log(
      LogLevel.Debug,
      `${this._contextLog} >> validaToken`,
      'Validando token de usuario',
      { endpoint: url, token: '***' } // no mostrar token completo
    );

    return this._webApiService.get<string>(url).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  public recuperaContrasena(correo: IRecuperaContrasena): Observable<any> {
    const url: string = WebApiConstants.usuario.recuperaContrasena;

     this._logger.log(
      LogLevel.Debug,
      `${this._contextLog} >> recuperaContrasena`,
      'Solicitud de recuperación de contraseña enviada',
      { endpoint: url, correo: correo.correo } // solo el correo
    );

    return this._webApiService.post<any>(url, correo).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

//#endregion Generales

}
