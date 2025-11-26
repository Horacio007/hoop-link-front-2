import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel, IonItem, IonAvatar, IonIcon, IonChip } from '@ionic/angular/standalone';
import { NewsBarComponent } from "src/app/layouts/authenticated-layout/components/news-bar/news-bar.component";
import { CoachService } from 'src/app/core/services/coach/coach.service';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import { BlockUiService } from 'src/app/core/services/blockUI/block-ui.service';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { ViewWillEnter } from '@ionic/angular';
import { CommonMessages, LogLevel, SeverityMessageType } from 'src/app/core/enums';
import { IResponse } from 'src/app/core/interfaces/response/response.interface';
import { ICatalogo } from 'src/app/shared/interfaces/catalogo/catalogo.interface';
import { IInformacinPersonal } from 'src/app/shared/interfaces/informacion-personal';
import { IListadoJugadores } from 'src/app/shared/interfaces/coach/listado-jugadores.interface';

@Component({
  selector: 'app-coach-listado-jugadores',
  templateUrl: './coach-listado-jugadores.page.html',
  styleUrls: ['./coach-listado-jugadores.page.scss'],
  standalone: true,
  imports: [IonChip, IonIcon, IonAvatar, IonItem, IonLabel, IonList, CommonModule, FormsModule, NewsBarComponent]
})
export class CoachListadoJugadoresPage implements OnInit, ViewWillEnter, OnDestroy {
//#region Propiedades
  private readonly _contextLog = 'CoachListadoJugadoresPage';
  public cargandoData = true;
  private readonly _destroy$ = new Subject<void>();
  public allListadoJugadores: IListadoJugadores[] = [];

  private readonly MOBILE_BREAKPOINT = 768;
  // La variable que usaremos en nuestro HTML (*ngIf)
  public isMobileView: boolean = false;
//#endregion

//#region Constructor
  constructor(
    private readonly _coachService: CoachService, private readonly _toastService: ToastService,
    private readonly _blockUserIService:BlockUiService, private readonly _logger: LoggerService,
  ) { }
//#endregion

//#region Ng
  ngOnInit(): void {
    this.inicializa();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
    this.checkScreenSize();
  }

  ionViewWillEnter() {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ionViewWillEnter`, 'La vista está a punto de entrar (cargando datos).');
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales
  private inicializa(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> inicializa`, 'Cargando datos...');
    this.cargaDatos();
  }

  private cargaDatos() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaDatos`, 'Obteniendo información personal...');

    this._coachService.getAllJugadores()
    .pipe(
      finalize(() => {
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaDatos`, 'Finalizada la carga CRÍTICA. Ocultando Skeleton.');
        this.cargandoData = false;
        takeUntil(this._destroy$)
      })
    )
    .subscribe({
      next: (response: IResponse<IListadoJugadores[] | undefined>) => {
        this._logger.log(LogLevel.Info, `${this._contextLog} >> cargaDatos`, 'Datos recibidos', response.data);
        const { data } = response;
        this.allListadoJugadores = data!;
      },
      error: (error) => {
        this._logger.log(LogLevel.Error, `${this._contextLog} >> cargaDatos`, 'Error al obtener listado de jugadores', error);
        this._toastService.showMessage(SeverityMessageType.Error, CommonMessages.Error, 'No se pudo cargar el listado de jugadores.');
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    // window.innerWidth te da el ancho actual del viewport
    const currentWidth = window.innerWidth;

    // Si el ancho es menor al breakpoint, es vista móvil
    this.isMobileView = currentWidth < this.MOBILE_BREAKPOINT;

    console.warn(`Ancho actual: ${currentWidth}px. Es móvil: ${this.isMobileView}`);
  }
//#endregion
}
