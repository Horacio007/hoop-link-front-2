import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SeverityMessageType, PositionMessageType } from '../../enums';

import { LoggerService } from '../../services/logger/logger.service';
import { LogLevel } from '../../enums';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

//#region Propiedades
  private readonly _contextLog = 'ToastService';
//#endregion

//#region Constructor
  constructor(private _messageService: MessageService, private readonly _logger: LoggerService) { }
//#endregion

//#region Servicios
  showMessage(severity: SeverityMessageType, summary: string, detail: string, position: PositionMessageType = PositionMessageType.TopRight, life:number = 3000) {
    this._messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      key: position,
      life: life
    });

    // Log del toast
    this._logger.log(
      LogLevel.Info,
      `${this._contextLog} >> showMessage`,
      `Toast mostrado`,
      { severity, summary, detail, position, life }
    );
  }

  clearMessages() {
    this._messageService.clear();

     // Log de limpieza
    this._logger.log(
      LogLevel.Debug,
      `${this._contextLog} >> clearMessages`,
      'Todos los toasts han sido eliminados'
    );
  }
//#endregion
}
