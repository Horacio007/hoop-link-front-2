import { Component, OnInit } from '@angular/core';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { HeaderComponent } from "../components/header/header.component";
import { IonRouterOutlet } from "@ionic/angular/standalone";

@Component({
  selector: 'app-public-portal-layout',
  templateUrl: './public-portal-layout.component.html',
  styleUrls: ['./public-portal-layout.component.scss'],
  imports: [IonRouterOutlet, HeaderComponent],
})
export class PublicPortalLayoutComponent  implements OnInit {

//#region Propiedades
  private readonly _contextLog = 'PublicPortalLayoutComponent';
//#endregion

//#region Constructor
  constructor(private readonly _logger: LoggerService) { }
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
