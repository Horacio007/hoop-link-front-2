import { Component, OnDestroy, OnInit } from '@angular/core';

import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LogLevel } from '../../../../core/enums';

@Component({
  selector: 'app-news-bar',
  imports: [],
  templateUrl: './news-bar.component.html',
  styleUrl: './news-bar.component.css'
})
export class NewsBarComponent implements OnInit, OnDestroy {

//#region Propiedades
  private readonly _contextLog = 'NewsBarComponent';
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
