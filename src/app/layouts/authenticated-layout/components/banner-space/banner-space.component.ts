import { Component, OnDestroy, OnInit } from '@angular/core';

import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LogLevel } from '../../../../core/enums';

@Component({
  selector: 'app-banner-space',
  imports: [],
  templateUrl: './banner-space.component.html',
  styleUrl: './banner-space.component.css'
})
export class BannerSpaceComponent implements OnInit, OnDestroy {

//#region Propieades
  private readonly _contextLog = 'BannerSpaceComponent';
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
