import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCardSubtitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { NewsBarComponent } from "src/app/layouts/authenticated-layout/components/news-bar/news-bar.component";
import { InformacionPersonalService } from 'src/app/core/services/informacion-personal/informacion-personal.service';
import { ViewWillEnter, ViewDidEnter } from '@ionic/angular';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { CommonMessages, LogLevel, SeverityMessageType } from 'src/app/core/enums';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { IResponse } from 'src/app/core/interfaces/response/response.interface';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { SkeletonComponent } from "src/app/shared/components/ionic/skeleton/skeleton.component";

@Component({
  selector: 'app-jugador-dashboard-index',
  templateUrl: './jugador-dashboard-index.page.html',
  styleUrls: ['./jugador-dashboard-index.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonCardSubtitle, CommonModule, FormsModule, NewsBarComponent, SkeletonComponent]
})
export class JugadorDashboardIndexPage implements OnInit, ViewDidEnter, OnDestroy {

//#region Variables
private readonly _contextLog = 'JugadorDashboardIndexPage';
public totalVistasPerfil: number | undefined  = 0;
private readonly _destroy$ = new Subject<void>();
public cargandoData = true;
//#endregion

//#region Constructor
  constructor(
    private readonly _informacionPersonalService:InformacionPersonalService,
    private readonly _logger: LoggerService,
    private readonly _toastService: ToastService,
  ) { }
//#endregion

//#region Ng
  ngOnInit() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
    this.inicializa();
  }

  ionViewDidEnter() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ionViewWillEnter`, 'Vista completa.');
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales

  private inicializa() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> inicializa`, 'Cargando información del dashboard.');
    this.cargaPaneles();
  }

  private cargaPaneles() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaPaneles`, 'Cargando información del dashboard.');

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaPaneles`, 'Cargando información de las vistas del perfil.');

    const totalVistasPerfil$ = this._informacionPersonalService.getTotalVistasPerfil().pipe(
      takeUntil(this._destroy$)
    );

    // 2. Usar forkJoin para esperar ambos
    forkJoin({
      totalVistasPerfil: totalVistasPerfil$
    })
    .pipe(
      // El finalize se ejecuta SOLO después de que forkJoin termine (éxito o error)
      finalize(() => {
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaPaneles`, 'Finalizada la carga CRÍTICA. Ocultando Skeleton.');
        this.cargandoData = false;
      })
    ).subscribe({
      next: (results: { totalVistasPerfil: IResponse<number | undefined>}) => {
        this._logger.log(LogLevel.Info, `${this._contextLog} >> cargaDatos >> ReadOnly`, 'Datos recibidos', results);

        this.totalVistasPerfil = results.totalVistasPerfil.data;

      },
      error: (error) => {
        this._logger.log(LogLevel.Error, `${this._contextLog} >> cargaDatos`, 'Error al obtener los paneles', error);
        this._toastService.showMessage(SeverityMessageType.Error, CommonMessages.Error, 'No se pudo cargar los paneles.');
      }
    });

  }

//#endregion

}
