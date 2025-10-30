import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { removeClass } from 'src/app/shared/utils/ui/design.util';
import { ViewWillEnter } from '@ionic/angular';
import { HeaderLegalComponent } from 'src/app/layouts/public-layout/components/header-legal/header-legal.component';
import { FooterComponent } from 'src/app/layouts/components/footer/footer.component';

@Component({
  selector: 'app-politica-cookies',
  templateUrl: './politica-cookies.page.html',
  styleUrls: ['./politica-cookies.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderLegalComponent, FooterComponent]
})
export class PoliticaCookiesPage implements OnInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  public sections = [
    { id: 'pol1', title: '¿Qué son las cookies?' },
    { id: 'pol2', title: 'Tipos de cookies que utilizamos' },
    { id: 'pol3', title: '¿Cómo gestionar las cookies?' },
    { id: 'pol4', title: 'Cookies de terceros' },
    { id: 'pol5', title: 'Cambios en esta Política de Cookies' },
    { id: 'pol6', title: 'Contacto' }
  ];

  private readonly _contextLog = 'PoliticaCookiesPage';
//#endregion

//#region Constructor
  constructor(private readonly _logger: LoggerService) { }
//#endregion

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

//#region Generales
  public moveToSection(id:string, event: Event) {
    event.preventDefault();
    removeClass('sectionLegalClick');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element?.classList.add('sectionLegalClick');
    }
  }
//#endregion

}
