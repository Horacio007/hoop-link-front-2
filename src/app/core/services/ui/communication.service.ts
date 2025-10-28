import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { LoggerService } from '../../services/logger/logger.service';
import { LogLevel } from '../../enums';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

//#region Propiedades
  private textLegalHeader = new BehaviorSubject<string>('');
  public currentTextLegalHeader = this.textLegalHeader.asObservable();

  private readonly _contextLog = 'CommunicationService';
//#endregion

//#region Constructor
  constructor(private readonly _logger:LoggerService) {}
//#endregion

//#region Servicios

  updateText(newText: string) {
    this._logger.log(
      LogLevel.Debug,
      `${this._contextLog} >> updateText`,
      'Texto legal header actualizado',
      { newText }
    );

    this.textLegalHeader.next(newText);
  }
//#endregion
}
