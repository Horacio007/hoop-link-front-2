import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderLegalComponent } from "src/app/layouts/public-layout/components/header-legal/header-legal.component";
import { FooterComponent } from "src/app/layouts/components/footer/footer.component";
import { ViewWillEnter } from '@ionic/angular';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { removeClass } from 'src/app/shared/utils/ui/design.util';

@Component({
  selector: 'app-politica-copyright',
  templateUrl: './politica-copyright.page.html',
  styleUrls: ['./politica-copyright.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderLegalComponent, FooterComponent]
})
export class PoliticaCopyrightPage implements OnInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  public sections = [
    { id: 'pol1', title: 'Propiedad Intelectual' },
    { id: 'pol2', title: 'Contenido Generado por Usuarios' },
    { id: 'pol3', title: 'Uso Permitido' },
    { id: 'pol4', title: 'Prohibiciones' },
    { id: 'pol5', title: 'Reclamos por Infracción de Copyright' },
    { id: 'pol6', title: 'Modificaciones a la Política de Copyright' },
    { id: 'pol7', title: 'Contacto' },
  ];

  private readonly _contextLog = 'PoliticaCopyrightComponent';
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
