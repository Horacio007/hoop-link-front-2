import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonCardContent } from '@ionic/angular/standalone';
import { NewsBarComponent } from "src/app/layouts/authenticated-layout/components/news-bar/news-bar.component";
import { Subject } from 'rxjs/internal/Subject';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { CommonMessages, LogLevel, SeverityMessageType } from 'src/app/core/enums';
import { SkeletonComponent } from "src/app/shared/components/ionic/skeleton/skeleton.component";
import { CoachService } from 'src/app/core/services/coach/coach.service';
import { takeUntil, forkJoin, finalize } from 'rxjs';
import { IResponse } from 'src/app/core/interfaces/response/response.interface';
import { addIcons } from 'ionicons';
import { settingsOutline, closeOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-coach-dashboard',
  templateUrl: './coach-dashboard.page.html',
  styleUrls: ['./coach-dashboard.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonIcon, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCard, CommonModule, FormsModule, NewsBarComponent, SkeletonComponent]
})
export class CoachDashboardPage implements OnInit {

//#region Variables
  private readonly _contextLog = 'JugadorDashboardIndexPage';
  public totalVistasPerfil: number | undefined  = 0;
  public totalFavoritosPerfil: number | undefined  = 0;
  private readonly _destroy$ = new Subject<void>();
public cargandoData = true;
//#endregion

//#region Constructor
  constructor(
    private readonly _logger: LoggerService,
    private readonly _toastService: ToastService,
    private readonly _coachService: CoachService,
  ) {
    addIcons({
      settingsOutline, closeOutline, eyeOutline
    })
  }
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

    const totalFavoritosPerfil$ = this._coachService.getTotalFavoritosPerfil().pipe(
      takeUntil(this._destroy$)
    );

    // 2. Usar forkJoin para esperar ambos
    forkJoin({
      totalFavoritosPerfil: totalFavoritosPerfil$
    })
    .pipe(
      // El finalize se ejecuta SOLO después de que forkJoin termine (éxito o error)
      finalize(() => {
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaPaneles`, 'Finalizada la carga CRÍTICA. Ocultando Skeleton.');
        this.cargandoData = false;
      })
    ).subscribe({
      next: (results: { totalFavoritosPerfil: IResponse<number | undefined>}) => {
        this._logger.log(LogLevel.Info, `${this._contextLog} >> cargaDatos >> ReadOnly`, 'Datos recibidos', results);

        this.totalFavoritosPerfil = results.totalFavoritosPerfil.data;

      },
      error: (error) => {
        this._logger.log(LogLevel.Error, `${this._contextLog} >> cargaDatos`, 'Error al obtener los paneles', error);
        this._toastService.showMessage(SeverityMessageType.Error, CommonMessages.Error, 'No se pudo cargar los paneles.');
      }
    });

  }

//#endregion

}
