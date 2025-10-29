import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonFooter, IonRouterOutlet } from '@ionic/angular/standalone';
import { HeaderComponent } from "../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-public-portal-layout',
  templateUrl: './public-portal-layout.page.html',
  styleUrls: ['./public-portal-layout.page.scss'],
  standalone: true,
  imports: [IonRouterOutlet, IonContent, IonHeader, CommonModule, FormsModule, HeaderComponent]
})
export class PublicPortalLayoutPage implements OnInit, OnDestroy, ViewWillEnter {

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

  ionViewWillEnter(): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ionViewWillEnter`, 'La vista está a punto de entrar (cargando datos).');
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

}
