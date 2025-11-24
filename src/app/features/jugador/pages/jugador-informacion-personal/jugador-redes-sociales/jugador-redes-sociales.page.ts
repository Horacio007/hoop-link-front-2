import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonCardSubtitle, IonCard, IonCardHeader, IonCardTitle, IonIcon, IonCardContent, IonModal, IonText, IonButtons, IonButton } from '@ionic/angular/standalone';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { SkeletonComponent } from "src/app/shared/components/ionic/skeleton/skeleton.component";

@Component({
  selector: 'app-jugador-redes-sociales',
  templateUrl: './jugador-redes-sociales.page.html',
  styleUrls: ['./jugador-redes-sociales.page.scss'],
  standalone: true,
  imports: [IonContent, IonToolbar, IonModal, IonButton, IonButtons, IonText, IonCardContent, IonIcon, IonCardTitle, IonCardHeader, IonCard, CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, IonInput, IonHeader]
})
export class JugadorRedesSocialesPage implements OnInit, OnDestroy {

//#region Propiedades
  @Input({required: true}) form!: FormGroup;
  @Input({required: true}) cargandoData: boolean = true;

  private readonly _contextLog = 'JugadorRedesSocialesComponent';

  @ViewChild('modalPresencia', { static: true }) modalPresencia!: IonModal;
//#endregion

//#region Constructor
  constructor(
    private readonly _formularioUtils: FormularioUtilsService,
    private readonly _logger: LoggerService,
  ) { }
//#endregion

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ngOnInit`, 'Inicializando componente.');
    console.log(this.form);
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ngOnDestroy`, 'Destruyendo componente.');
  }

//#endregion

//#region Generales
  public esValido(campo: string):boolean| null {
    return this._formularioUtils.esCampoValido(this.form, campo);
  }

  public esOpcionalValido(campo: string):boolean| null {
    return this._formularioUtils.esCampoOpcionalValido(this.form, campo);
  }

  public getErrores(campo: string, nombreMostrar:string):string | null {
    const errores = this._formularioUtils.getCampoError(this.form, campo, nombreMostrar);
    return errores;
  }

  public openModalPresencia() {
    this.modalPresencia.present();
  }

  public closeModalPresencia() {
    this.modalPresencia.dismiss();
  }
//#endregion


}
