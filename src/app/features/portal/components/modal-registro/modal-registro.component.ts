import { Component, OnDestroy, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonButtons, ModalController, IonLabel } from '@ionic/angular/standalone';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.component.html',
  styleUrls: ['./modal-registro.component.scss'],
  standalone: true,
  imports: [IonLabel,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon
  ],
})
export class ModalRegistroComponent  implements OnInit, OnDestroy {

//#region Propieades
  @Input() esVisibleDialog!: boolean;
  @Output() esVisibleDialogChange = new EventEmitter<boolean>();

  private readonly _contextLog = 'ModalRegistroComponent';
//#endregion

//#region Constructor
  constructor(private readonly _logger: LoggerService, private modalCtrl: ModalController) {
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
    this.modalCtrl.dismiss();
  }

  onCerrarModal() {
    // Llama a dismiss() para cerrar el modal
    this.modalCtrl.dismiss();
  }
//#endregion

}
