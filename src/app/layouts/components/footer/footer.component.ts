import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { LoggerService } from '../../../core/services/logger/logger.service';
import { LogLevel } from '../../../core/enums';
import { IonImg, IonFooter, IonIcon } from "@ionic/angular/standalone";

import { addIcons } from 'ionicons';
import { logoInstagram, logoWhatsapp, logoYoutube, logoTiktok, logoFacebook } from 'ionicons/icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IonIcon, IonFooter, IonImg,  RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {

//#region Propiedades
  public anio:number = new Date().getFullYear();
  public sections = [
    { route: '/legal/acerca-de', title: 'Acerca de' },
    { route: '/legal/condiciones-uso', title: 'Condiciones de uso' },
    { route: '/legal/politica-privacidad', title: 'Política de privacidad' },
    { route: '/legal/politica-cookies', title: 'Política de cookies' },
    { route: '/legal/politica-copyright', title: 'Política de copyright' },
    { route: '/legal/politica-marca', title: 'Política de marca' },
  ];

  public isLegal: boolean = false;

  private readonly _contextLog = 'FooterComponent';
//#endregion

//#region Constructor
  constructor(
    private router: Router, private readonly _logger: LoggerService
  ) {
    addIcons({
      logoInstagram, logoWhatsapp, logoYoutube, logoTiktok, logoFacebook
    });

    if (this.router.url.split('/')[1] === 'legal') {
      this.isLegal = true;
    }
  }
//#endregion

//#region Ng
  ngOnInit(): void {
    const contexto = this.isLegal ? 'Sección legal' : 'Portal principal';
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, `Componente inicializado en ${contexto}.`);
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales
  public redirectHome():void {
    if (!this.isLegal) {
      this._logger.log(LogLevel.Info, `${this._contextLog} >> redirectHome`, 'Usuario redirigido al portal.');
      this.router.navigateByUrl('/portal')
    }
  }
//#endregion
}
