import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ViewWillEnter } from '@ionic/angular';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { removeClass } from 'src/app/shared/utils/ui/design.util';
import { HeaderLegalComponent } from 'src/app/layouts/public-layout/components/header-legal/header-legal.component';
import { FooterComponent } from 'src/app/layouts/components/footer/footer.component';

@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.page.html',
  styleUrls: ['./politica-privacidad.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderLegalComponent, FooterComponent]
})
export class PoliticaPrivacidadPage implements OnInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  public sections = [
    { id: 'pol1', title: 'Responsable del Tratamiento de Datos' },
    { id: 'pol2', title: 'Datos Personales que Recopilamos' },
    { id: 'pol3', title: 'Finalidades del Tratamiento' },
    { id: 'pol4', title: 'Transferencia de Datos' },
    { id: 'pol5', title: 'Derechos ARCO' },
    { id: 'pol6', title: 'Uso de Cookies y Tecnologías Similares' },
    { id: 'pol7', title: 'Seguridad de los Datos' },
    { id: 'pol8', title: 'Cambios a la Política de Privacidad' },
  ];

  private readonly _contextLog = 'PoliticaPrivacidadPage';

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
