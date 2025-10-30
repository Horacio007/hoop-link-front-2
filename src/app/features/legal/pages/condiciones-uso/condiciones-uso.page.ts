import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ViewWillEnter } from '@ionic/angular';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { HeaderLegalComponent } from 'src/app/layouts/public-layout/components/header-legal/header-legal.component';
import { FooterComponent } from 'src/app/layouts/components/footer/footer.component';

@Component({
  selector: 'app-condiciones-uso',
  templateUrl: './condiciones-uso.page.html',
  styleUrls: ['./condiciones-uso.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderLegalComponent, FooterComponent]
})
export class CondicionesUsoPage implements OnInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  public sections = [
    { id: 'pol1', title: 'Aceptación de los Términos' },
    { id: 'pol2', title: 'Registro y Cuenta de Usuario' },
    { id: 'pol3', title: 'Usuarios Menores de Edad' },
    { id: 'pol4', title: 'Uso Permitido de la Plataforma' },
    { id: 'pol5', title: 'Contenido Generado por Usuarios' },
    { id: 'pol6', title: 'Privacidad y Protección de Datos' },
    { id: 'pol7', title: 'Responsabilidad de HoopLink' },
    { id: 'pol8', title: 'Suspensión y Terminación de Cuentas' },
    { id: 'pol9', title: 'Modificaciones a los Términos y Condiciones' },
    { id: 'pol10', title: 'Contacto' },
    { id: 'pol11', title: 'Ley Aplicable y Jurisdicción' },
  ];

  private readonly _contextLog = 'CondicionesUsoComponent';
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
    this.removeClass();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element?.classList.add('sectionLegalClick');
    }
  }

  private removeClass() {
    const pasados = document.getElementsByClassName('sectionLegalClick');
    if (pasados.length > 0) {
      for (let index = 0; index < pasados.length; index++) {
        pasados[index].classList.remove('sectionLegalClick');
      }
    }
  }
//#endregion
}
