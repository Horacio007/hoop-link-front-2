import { Injectable } from '@angular/core';
import { BlockUI } from 'primeng/blockui';
import { OverlayComponent } from '../../components/overlay/overlay.component';

import { LoggerService } from '../../services/logger/logger.service';
import { LogLevel } from '../../enums';

@Injectable({
  providedIn: 'root'
})
export class BlockUserIService {

//#region Propiedades
  private overlayComponent: OverlayComponent | null = null;

  private readonly _contextLog = 'BlockUserIService';
//#endregion

//#region Constructor
  constructor(private readonly _logger: LoggerService) {}
//#endregion

//#region Servicios

  setLoadingComponent(component: OverlayComponent) {
    this.overlayComponent = component;

    this._logger.log(
      LogLevel.Debug,
      `${this._contextLog} >> setLoadingComponent`,
      'OverlayComponent asignado al servicio',
      { component }
    );
  }

  show(mensaje: string = 'Cargando...') {
    if (this.overlayComponent) {
      this.overlayComponent.blockDocument(mensaje);
      this._logger.log(
        LogLevel.Debug,
        `${this._contextLog} >> show`,
        'Overlay bloqueado',
        { mensaje }
      );
    } else {
      this._logger.log(
        LogLevel.Warn,
        `${this._contextLog} >> show`,
        'Intento de bloquear overlay sin componente asignado',
        { mensaje }
      );
    }
  }

  hide() {
    if (this.overlayComponent) {
      this.overlayComponent.unblockDocument();
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> hide`, 'Overlay desbloqueado');
    } else {
      this._logger.log(
        LogLevel.Warn,
        `${this._contextLog} >> hide`,
        'Intento de desbloquear overlay sin componente asignado'
      );
    }
  }

  setProgress(progress: number = 0) {
    if (this.overlayComponent) {
      this.overlayComponent.setProgress(progress);
      this._logger.log(
        LogLevel.Debug,
        `${this._contextLog} >> setProgress`,
        'Progreso del overlay actualizado',
        { progress }
      );
    } else {
      this._logger.log(
        LogLevel.Warn,
        `${this._contextLog} >> setProgress`,
        'Intento de setProgress sin componente asignado',
        { progress }
      );
    }
  }

//#endregion

}
