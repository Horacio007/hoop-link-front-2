import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { InformacionPersonalService } from '../../../../core/services/informacion-personal/informacion-personal.service';
import { WebApiConstants } from '../../../../core/constants/web-api/web-api.constants';
import { IResponse } from '../../../../core/interfaces/response/response.interface';
import { IVideoInformacionPersonalResponse } from '../../../../shared/interfaces/video/videos-response.interface';
import { JugadorConstants } from '../../constants/general/general.constants';
import { BlockUiService } from './../../../../core/services/blockUI/block-ui.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SeverityMessageType } from '../../../../core/enums';
import { ToastService } from '../../../../core/services/messages/toast.service';
import { HttpEventType } from '@angular/common/http';

import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LogLevel } from '../../../../core/enums';

@Component({
  selector: 'app-video-uploader',
  imports: [
    CommonModule
  ],
  templateUrl: './video-uploader.component.html',
  styleUrl: './video-uploader.component.scss'
})
export class VideoUploaderComponent implements OnInit, OnDestroy {

//#region Propiedades
  @Input() label = 'Subir video';
  @Input() maxSizeMB = 30;
  @Input() maxDurationSec = 60;
  @Input() errorMessage: string | null = null;
  @Input() videoUrl: string | null = null;
  @Input() id: string | null = '';

  @Output() videoSelected = new EventEmitter<File | number>();
  @Output() fileError = new EventEmitter<string>();
  @Output() videoUploaded = new EventEmitter<string>(); // URL o ID del video subido
  @Output() videoUploadedId = new EventEmitter<string>(); // URL o ID del video subido

  previewUrl: string | null = null;

  private readonly _contextLog = 'VideoUploaderComponent';
  private _destroy$ = new Subject<void>();

  @Input({required: true }) isReadOnly: boolean = false;
//#endregion

//#region Constructor
  constructor(
    private readonly _informacionPersonalService:InformacionPersonalService,
    private readonly _blockUserIService:BlockUiService,
    private readonly _toastService: ToastService,
    private readonly _logger: LoggerService
  ) { }
//#endregion

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, `Componente inicializado.`);
    if (this.videoUrl) {
      this.previewUrl = this.videoUrl;
      this._logger.log(LogLevel.Info, `${this._contextLog} >> ngOnInit`, `Inicializado con video existente`, { videoUrl: this.videoUrl });
    } else {
      this._logger.log(LogLevel.Info, `${this._contextLog} >> ngOnInit`, `Inicializado sin video previo`);
    }
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, `Componente destruido.`);
    this._destroy$.next();
    this._destroy$.complete();
  }
//#endregion

//#region Generales
  onFileSelected(event: Event) {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> onFileSelected`, `Evento de selección de archivo detectado`);

    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> onFileSelected`, `No se seleccionó ningún archivo`);
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > this.maxSizeMB) {
      const msg = `El archivo supera el máximo permitido (${fileSizeMB.toFixed(2)} MB > ${this.maxSizeMB} MB)`;
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> onFileSelected`, msg);
      this.fileError.emit(msg);
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = videoUrl;

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> onFileSelected`, `Validando duración del video...`);

    video.onloadedmetadata = () => {
      if (video.duration > this.maxDurationSec) {
        const msg = `Duración máxima excedida (${video.duration.toFixed(1)}s > ${this.maxDurationSec}s)`;
        this._logger.log(LogLevel.Warn, `${this._contextLog} >> onFileSelected`, msg);
        this.fileError.emit(msg);
        URL.revokeObjectURL(videoUrl);
      } else {
        this.previewUrl = videoUrl;
        this._logger.log(LogLevel.Info, `${this._contextLog} >> onFileSelected`, `Archivo válido, iniciando subida`);
        this.videoSelected.emit(file);
        this.uploadVideo(file);
      }
    };
  }

  private uploadVideo(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this._logger.log(LogLevel.Info, `${this._contextLog} >> onFileSelected`, `Iniciando subida del archivo`, { fileName: file.name });

    this._blockUserIService.show(JugadorConstants.SUBIENDO_VIDEO);
    // this._blockUserIService.setProgress(45); // ejemplo

    this._informacionPersonalService.uploadVideos(this.label, `?id=${this.label}`, formData).pipe(
      takeUntil(this._destroy$),
      finalize( () => {
        this._blockUserIService.hide();
        this._logger.log(LogLevel.Info, `${this._contextLog} >> onFileSelected`, `Subida finalizada (independientemente del resultado)`);
      })
    )
    .subscribe({
    next: (event) => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        // Actualizas la barra o texto de progreso
        this._blockUserIService.updateMessage(percentDone.toString());
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> onFileSelected`, `Progreso de carga: ${percentDone}%`);
        this._blockUserIService.show(`Subiendo video ${percentDone} de 100`);
      } else if (event.type === HttpEventType.Response) {
        // Evento con la respuesta final
        const response = event.body as IResponse<IVideoInformacionPersonalResponse>;
        this.previewUrl = response.data?.pathPublic ?? null;
        this.videoSelected.emit(response.data?.ficheroId);
        this._toastService.showMessage(SeverityMessageType.Success, 'Genial', 'Video actualizado.', 5000);
        this._logger.log(LogLevel.Info, `${this._contextLog} >> onFileSelected`, `Video subido exitosamente`, response.data);
        // this._blockUserIService.hide();
      }
    },
    error: (err) => {
      this._logger.log(LogLevel.Error, `${this._contextLog} >> onFileSelected`, `Error al subir video`, err);
      this.fileError.emit('Error al subir el video');
      // this._blockUserIService.hide();
    }
  });
  }
//#endregion
}
