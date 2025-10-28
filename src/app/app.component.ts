import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './core/auth/services/auth.service';
import { LogLevel } from './core/enums';
import { LoggerService } from './core/services/logger/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  //#region Propiedades
  private readonly _contextLog = 'AppComponent';
//#endregion

//#region Constructor
  constructor(private authService: AuthService, private readonly _logger: LoggerService) {}
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
