import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { removeClass } from 'src/app/shared/utils/ui/design.util';
import { ViewWillEnter } from '@ionic/angular';
import { HeaderLegalComponent } from "src/app/layouts/public-layout/components/header-legal/header-legal.component";
import { FooterComponent } from "src/app/layouts/components/footer/footer.component";
import { ColorPickerPersonalizadoComponent } from 'src/app/shared/components/color-picker-personalizado/color-picker-personalizado.component';

@Component({
  selector: 'app-politica-marca',
  templateUrl: './politica-marca.page.html',
  styleUrls: ['./politica-marca.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderLegalComponent, FooterComponent, ColorPickerPersonalizadoComponent]
})
export class PoliticaMarcaPage implements OnInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  public sections = [
    { id: 'pol1', title: 'Misión y Valores de la Marca' },
    { id: 'pol2', title: 'Logo y Su Uso Correcto' },
    { id: 'pol3', title: 'Paleta de Colores' },
    { id: 'pol4', title: 'Tipografía Oficial' },
    { id: 'pol5', title: 'Tono y Estilo de Comunicación' },
    { id: 'pol6', title: 'Usos Prohibidos' },
    { id: 'pol7', title: 'Aplicaciones de la Marca' },
    { id: 'pol8', title: 'Contacto y Autorizaciones' },
  ];

  private readonly _contextLog = 'PoliticaMarcaPage';

  public naranjaIntenso = '#f14e23';
  public naranja = '#f47621';
  public azulProdunfo = '#0c2251';
  public azulMarino = '#003e61';
  public azulVerde = '#004e6d';
  public azulClaro = '#deebf9';

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
