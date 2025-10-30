import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel } from '@ionic/angular/standalone';
import { HeaderComponent } from "src/app/layouts/public-layout/components/header/header.component";
import { FooterComponent } from "src/app/layouts/components/footer/footer.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.page.html',
  styleUrls: ['./terminos-condiciones.page.scss'],
  standalone: true,
  imports: [IonLabel, IonContent, CommonModule, FormsModule, HeaderComponent, FooterComponent, RouterModule]
})
export class TerminosCondicionesPage implements OnInit, OnDestroy, ViewWillEnter {

  //#region Propiedades
  public sections = [
    { route: '/legal/acerca-de', title: 'Acerca de' },
    { route: '/legal/condiciones-uso', title: 'Condiciones de uso' },
    { route: '/legal/politica-privacidad', title: 'Política de privacidad' },
    { route: '/legal/politica-cookies', title: 'Política de cookies' },
    { route: '/legal/politica-copyright', title: 'Política de copyright' },
    { route: '/legal/politica-marca', title: 'Política de marca' },
  ];

  private readonly _contextLog = 'TerminosCondicionesComponent';
//#endregion Propiedades

  //#region Constructor
  constructor(
    private readonly _logger: LoggerService
  ) { }
  //#endregion Constructor

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
  }

  ionViewWillEnter() {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ionViewWillEnter`, 'La vista está a punto de entrar (cargando datos).');
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

}
