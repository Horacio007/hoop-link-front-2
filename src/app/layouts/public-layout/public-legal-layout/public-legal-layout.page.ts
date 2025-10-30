import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-public-legal-layout',
  templateUrl: './public-legal-layout.page.html',
  styleUrls: ['./public-legal-layout.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonRouterOutlet]
})
export class PublicLegalLayoutPage implements OnInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  private readonly _contextLog = 'PublicLegalLayoutPage';
//#endregion

//#region Constructor
  constructor(private readonly _logger: LoggerService) { }

//#endregion

//#region Ng
  ngOnInit() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, `Componente inicializado.`);
  }

  ionViewWillEnter(): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ionViewWillEnter`, 'La vista está a punto de entrar (cargando datos).');
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion
}
