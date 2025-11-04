import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-modal-token-valido',
  templateUrl: './modal-token-valido.component.html',
  styleUrls: ['./modal-token-valido.component.scss'],
  imports: [
    IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon
  ]
})
export class ModalTokenValidoComponent  implements OnInit, OnDestroy {

//#region Propiedades
  @Input() esVisibleDialog!: boolean;
  @Output() esVisibleDialogChange = new EventEmitter<boolean>();

  private readonly _contextLog = 'ModalTokenValidoComponent';
 //#endregion

 //#region Constructor
  constructor(
    private readonly _logger: LoggerService, private modalCtrl: ModalController
  ) {
    addIcons({
      closeOutline
    });
  }
//#endregion

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }

//#endregion

//#region Generales
  onDidDismiss() {
    this.modalCtrl.dismiss(false);
  }
//#endregion
}
