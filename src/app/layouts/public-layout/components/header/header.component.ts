import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon, IonPopover, IonContent, IonList, IonItem, IonLabel } from "@ionic/angular/standalone";
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { IResizeImg } from 'src/app/shared/interfaces/ui/ui.interface';
import { redibujaImg } from 'src/app/shared/utils/ui/responsive.util';
import { addIcons } from 'ionicons';
import { menuOutline, trophyOutline, businessOutline, calendarOutline, starOutline, briefcaseOutline } from 'ionicons/icons';
import { IHeader } from './interface/header.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonLabel, IonItem, IonList, IonPopover, IonButton, IonIcon, IonContent]
})
export class HeaderComponent  implements OnInit, OnDestroy {

//#region Propiedades
  // public items: MenuItem[] | undefined;
  public widthImg:string = "350";
  private _imgWidht:IResizeImg = {
    limSuperior:550,
    limInferior:350,
    valSuperior:250,
    valInferior:350,
  };

  private readonly _contextLog = 'HeaderComponent';
  public listLinks: IHeader[] = [
    {
      icon: 'trophy-outline',
      name: 'Jugadores',
      url: ''
    },
     {
      icon: 'business-outline',
      name: 'Escuelas',
      url: ''
    },
     {
      icon: 'calendar-outline',
      name: 'Eventos',
      url: ''
    },
     {
      icon: 'star-outline',
      name: 'Patrocinadores',
      url: ''
    },
     {
      icon: 'briefcase-outline',
      name: 'Empresas',
      url: ''
    }
  ];
//#endregion

//#region Constructor
  constructor(private router: Router, private readonly _logger: LoggerService) {
    addIcons({
      menuOutline,trophyOutline, businessOutline, calendarOutline, starOutline, briefcaseOutline
    });
  }
//#endregion

//#region Ng
  ngOnInit() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, `Componente inicializado.`);

    this.widthImg = redibujaImg(this._imgWidht, 1);
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthImg = redibujaImg(this._imgWidht, 1);
  }

  public redirectHome():void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> redirectHome`, 'Usuario redirigido al portal.');
    this.router.navigateByUrl('/portal');
  }

  public goLogin() {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> goLogin`, 'Usuario redirigido al login.');
    this.router.navigateByUrl('/login')
  }
//#endregion
}
