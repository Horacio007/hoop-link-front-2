import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardSubtitle, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonModal, IonButton, IonButtons, IonText, IonIcon } from '@ionic/angular/standalone';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { SkeletonComponent } from "src/app/shared/components/ionic/skeleton/skeleton.component";
import { VideoUploaderComponent } from '../../../components/video-uploader/video-uploader.component';

@Component({
  selector: 'app-jugador-videos',
  templateUrl: './jugador-videos.page.html',
  styleUrls: ['./jugador-videos.page.scss'],
  standalone: true,
  imports: [IonIcon, IonToolbar, IonContent ,IonModal, IonText, IonButtons, IonButton, IonCardTitle, IonCardContent, IonCardHeader, IonCard, CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, VideoUploaderComponent, IonHeader]
})
export class JugadorVideosPage implements OnInit, OnDestroy {
//#region Propiedades
  @Input({required: true}) form!: FormGroup;
  @Input({required: true}) cargandoData: boolean = true;
  public categorias = [
    { key: 'botando', label: 'Botando' },
    { key: 'tirando', label: 'Tirando' },
    { key: 'coladas', label: 'Coladas' },
    { key: 'entrenando', label: 'Entrenando' },
    { key: 'jugando', label: 'Jugando' }
  ];

  public videoErrors: Record<string, string | null> = {
    videoBotando: null,
    videoTirando: null,
    videoColada: null,
    videoEntrenando: null,
    videoJughando: null,
  };

  public videoBotandoUrl: string = '';
  public videoTirandoUrl: string = '';
  public videoColadaUrl: string = '';
  public videoEntrenandoUrl: string = '';
  public videoJugandoUrl: string = '';

  private readonly _contextLog = 'JugadorVideosPage';

  @ViewChild('modalDemostracion', { static: true }) modalDemostracion!: IonModal;
//#endregion

//#region Constructor
  constructor(
    private readonly _logger: LoggerService
  ) {}
//#endregion

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');

    this.videoBotandoUrl = this.form.get('videoBotando')?.value;
    this.videoTirandoUrl = this.form.get('videoTirando')?.value;
    this.videoColadaUrl = this.form.get('videoColada')?.value;
    this.videoEntrenandoUrl = this.form.get('videoEntrenando')?.value;
    this.videoJugandoUrl = this.form.get('videoJugando')?.value;
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }

//#endregion

//#region Generales

  handleVideoError(key: string, message: string) {
    this.videoErrors[key] = message;

    const control = this.form.get(`videos.${key}`);
    if (control) {
      control.setErrors({ invalid: true });
    }

    this._logger.log(LogLevel.Warn, `${this._contextLog} >> handleVideoError`, `Error en video de la categoría "${key}"`, message);
  }

  public openModalDemostracion() {
    this.modalDemostracion.present();
  }

  public closeModalDemostracion() {
    this.modalDemostracion.dismiss();
  }
//#endregion
}
