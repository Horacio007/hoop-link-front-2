import { Component, OnDestroy, OnInit } from '@angular/core';

import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LogLevel } from '../../../../core/enums';

@Component({
  selector: 'app-info-cards',
  imports: [],
  templateUrl: './info-cards.component.html',
  styleUrl: './info-cards.component.css'
})
export class InfoCardsComponent implements OnInit, OnDestroy {

//#region Propiedades
  private readonly _contextLog = 'InfoCardsComponent';
//#endregion

//#region Constructor
  constructor(private readonly _logger: LoggerService) { }
//#endregion

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

}
