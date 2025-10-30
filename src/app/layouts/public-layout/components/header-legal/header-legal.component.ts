import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { IResizeImg } from 'src/app/shared/interfaces/ui/ui.interface';
import { redibujaImg } from 'src/app/shared/utils/ui/responsive.util';
import { IonPopover, IonIcon, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header-legal',
  templateUrl: './header-legal.component.html',
  styleUrls: ['./header-legal.component.scss'],
})
export class HeaderLegalComponent  implements OnInit, OnDestroy {

//#region Propiedades
  public title:string = '';
  public widthImg:string = "500";
  private _imgWidht:IResizeImg = {
    limSuperior:550,
    limInferior:350,
    valSuperior:250,
    valInferior:500,
  };

  private readonly _contextLog = 'HeaderLegalComponent';
//#endregion

//#region Constructor
  constructor(private readonly _logger: LoggerService) { }
//#endregion

//#region Ng
  ngOnInit() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, `Componente inicializado.`);

    this.widthImg = redibujaImg(this._imgWidht, 1);
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthImg = redibujaImg(this._imgWidht, 1);
  }
//#endregion
}
