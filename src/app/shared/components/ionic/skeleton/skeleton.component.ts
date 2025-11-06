import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { IonSkeletonText, IonThumbnail } from "@ionic/angular/standalone";

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  imports: [
    IonSkeletonText,
    IonThumbnail
  ]
})
export class SkeletonComponent implements OnInit, OnDestroy {
//#region Propiedades
  @Input() type: 'circle' | 'rectangle' =  'rectangle';
  @Input() size: string = '';
  @Input() style: string = '';

  private readonly _contextLog = 'SkeletonComponent';
//#endregion

//#region Constructor
  constructor(
    private readonly _logger: LoggerService
  ) { }
//#endregion

//#region Ng
  ngOnInit() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, `Componente inicializado.`);
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

}
