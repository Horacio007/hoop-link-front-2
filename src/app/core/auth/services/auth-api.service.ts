import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../../environments/environment";

import { ILogin, ITokens } from "../interfaces";
import { IResponse } from "../../interfaces/response/response.interface";

import { WebApiConstants } from "../../constants/web-api/web-api.constants";

import { LoggerService } from '../../services/logger/logger.service';

import { LogLevel } from '../../enums';

// auth-api.service.ts
@Injectable({ providedIn: 'root' })
export class AuthApiService {

//#region Propiedades
  private readonly _contextLog = 'AuthApiService';
//#endregion

//#region Constructor
  constructor(private _http: HttpClient, private _logger: LoggerService) {}
//#endregion

//#region Servicios

  login(credenciales: ILogin): Observable<IResponse<ITokens>> {
    const safeCreds = { ...credenciales, contrasena: '****' };
    const url:string = `${environment.apiUrl}/${WebApiConstants.auth.login}`;

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> login`, 'Login iniciado', { endpoint: url, safeCreds});

    return this._http.post<IResponse<ITokens>>(url, credenciales,);
  }

  refreshToken(refreshToken: string): Observable<IResponse<ITokens>> {
    const url:string = `${environment.apiUrl}/${WebApiConstants.auth.refresh}`;

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> refreshToken`, 'Refresh token iniciado', { refreshToken });

    return this._http.post<IResponse<ITokens>>(url, { endpoint: url, refreshToken });
  }

  logout(refreshToken: string): Observable<IResponse<any>> {
    const url:string = `${environment.apiUrl}/${WebApiConstants.auth.logout}`;

    this._logger.log(LogLevel.Info, `${this._contextLog} >> logout`, 'Logout iniciado', { endpoint: url, refreshToken });

    return this._http.post<IResponse<any>>(url, { refreshToken });
  }
//#endregion

}
