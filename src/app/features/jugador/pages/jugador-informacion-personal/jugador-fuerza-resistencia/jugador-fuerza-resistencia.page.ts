import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonIcon, IonModal, IonButton, IonHeader, IonToolbar, IonButtons, IonContent, IonText } from '@ionic/angular/standalone';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { SkeletonComponent } from 'src/app/shared/components/ionic/skeleton/skeleton.component';

@Component({
  selector: 'app-jugador-fuerza-resistencia',
  templateUrl: './jugador-fuerza-resistencia.page.html',
  styleUrls: ['./jugador-fuerza-resistencia.page.scss'],
  standalone: true,
  imports: [IonModal, IonText, IonContent, IonButtons, IonToolbar, IonHeader, IonButton, IonIcon, IonCardContent, IonCardHeader, IonCardTitle, IonCard, CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, IonInput]
})
export class JugadorFuerzaResistenciaPage implements OnInit, OnDestroy {

//#region Propiedades
  @Input({required: true}) form!: FormGroup;
  @Input({required: true}) cargandoData: boolean = true;

  private readonly _contextLog = 'JugadorFuerzaResistenciaPage';

  @ViewChild('modalPotencia', { static: true }) modalPotencia!: IonModal;
  @ViewChild('modalFuerza', { static: true }) modalFuerza!: IonModal;
  @ViewChild('modalResistencia', { static: true }) modalResistencia!: IonModal;
//#endregion
//#endregion

//#region Constructor
  constructor(
    private readonly _formularioUtils: FormularioUtilsService, private readonly _logger: LoggerService,
  ) { }
//#endregion

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
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

  public openModalPotencia() {
    this.modalPotencia.present();
  }

  public closeModalPotencia() {
    this.modalPotencia.dismiss();
  }

  public openModalFuerza() {
    this.modalFuerza.present();
  }

  public closeModalFuerza() {
    this.modalFuerza.dismiss();
  }

  public openModalResistencia() {
    this.modalResistencia.present();
  }

  public closeModalResistencia() {
    this.modalResistencia.dismiss();
  }
//#endregion

}
