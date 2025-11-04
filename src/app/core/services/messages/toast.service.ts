import { Injectable } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { SeverityMessageType, PositionMessageType } from '../../enums';
import { LoggerService } from '../../services/logger/logger.service';
import { LogLevel } from '../../enums';

import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircleOutline, alertCircle, informationCircle } from 'ionicons/icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

//#region Propiedades
  // Eliminamos 'private currentToast: HTMLIonToastElement | null = null;' para permitir múltiples toasts.
  private readonly _contextLog = 'ToastService';
//#endregion

//#region Constructor
  constructor(
    private readonly _platform: Platform,
    private readonly _logger: LoggerService,
    private _toastController: ToastController,
    private sanitizer: DomSanitizer,
  ) {

    addIcons({
      checkmarkCircle, closeCircleOutline, alertCircle, informationCircle
    });

  }
//#endregion

// -------------------------------------------------------------
// FUNCIONES DE UTILIDAD
// -------------------------------------------------------------

  private getIonicColor(severity: SeverityMessageType): string {
    switch (severity) {
      case SeverityMessageType.Success: return 'success';
      case SeverityMessageType.Error: return 'danger';
      case SeverityMessageType.Warning: return 'warning';
      case SeverityMessageType.Info: return 'primary';
      default: return 'medium';
    }
  }

  // Función para obtener la clase CSS del host del toast
  private getHostCssClass(severity: SeverityMessageType): string {
    const color = this.getIonicColor(severity);
    return `custom-toast-${color}`;
  }


  private getIonicIcon(severity: SeverityMessageType): string {
    switch (severity) {
      case SeverityMessageType.Success: return 'checkmark-circle';
      case SeverityMessageType.Error: return 'close-circle-outline';
      case SeverityMessageType.Warning: return 'alert-circle';
      case SeverityMessageType.Info: return 'information-circle';
      default: return 'notifications';
    }
  }

//#region Servicios

  async showMessage(
    severity: SeverityMessageType,
    summary: string,
    detail: string,
    life: number = 3000
  ) {
    // ELIMINAMOS la llamada a 'await this.clearMessages();'
    // ELIMINAMOS la asignación a 'this.currentToast' (línea 106 original)

    const toastPosition: 'top' | 'bottom' | 'middle' = this._platform.is('mobile') ? 'bottom' : 'top';

    const color = this.getIonicColor(severity);
    const hostCssClass = this.getHostCssClass(severity);
    const iconName = this.getIonicIcon(severity);

    // Generamos el HTML inyectando la clase de color para el header
    const htmlMessage = this.getHtml(iconName, summary, detail, color);
    const safeHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlMessage);
    const messageContent: string = (safeHtml as any).changingThisBreaksApplicationSecurity;


    const newToast = await this._toastController.create({ // <-- Usamos 'newToast' local
      message: detail,
      duration: life,
      // Aplicamos la clase base y la clase específica de color al host
      cssClass: hostCssClass,
      position: toastPosition,
      buttons: [{
        icon: 'close-circle-outline',
        side: 'end',
        // El handler de cierre seguirá funcionando para este toast específico.
        handler: () => {
          // No necesitamos llamar a clearMessages, solo dismiss del propio toast.
          newToast.dismiss();
        }
      }],
      header: `${summary}`,
      layout: "baseline"
    });

    await newToast.present(); // <-- Presentamos el nuevo toast

    this._logger.log(
      LogLevel.Info,
      `${this._contextLog} >> showMessage`,
      `Toast mostrado`,
      { severity, summary, detail, position: toastPosition, life }
    );
  }

  // ACEPTA EL PARÁMETRO DE COLOR
private getHtml(iconName: string, summary: string, detail:string, color: string):string {
  // Inyectamos la clase de color directamente en el header
  const headerClass = `toast-header color-${color}`;

  return `
    <div>
      <ion-icon name="${iconName}" class="ion-margin-end"></ion-icon>
      <span>${summary}</span>
    </div>
    <div >
      ${detail}
    </div>
  `;
}

//#endregion
}
