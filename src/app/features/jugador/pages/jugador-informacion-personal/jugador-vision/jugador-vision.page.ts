import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { SkeletonComponent } from "src/app/shared/components/ionic/skeleton/skeleton.component";
import { IonTextarea, IonCardSubtitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonModal, IonToolbar, IonHeader, IonText, IonContent, IonButton, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-jugador-vision',
  templateUrl: './jugador-vision.page.html',
  styleUrls: ['./jugador-vision.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonContent, IonText, IonHeader, IonToolbar, IonModal, IonIcon, IonCardContent, IonCardTitle, IonCardHeader, IonCard, CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, IonTextarea]
})
export class JugadorVisionPage implements OnInit, OnDestroy {
//#region Propiedades
  @Input({required: true}) form!: FormGroup;
  @Input({required: true}) cargandoData: boolean = true;

  private readonly _contextLog = 'JugadorVisionPage';

  @ViewChild('modalFilosofia', { static: true }) modalFilosofia!: IonModal;
//#endregion

//#region Constructor
  constructor(
    private readonly _formularioUtils: FormularioUtilsService, private readonly _logger: LoggerService
  ) { }
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

  public openModalFilosofia() {
    this.modalFilosofia.present();
  }

  public closeModalFilosofia() {
    this.modalFilosofia.dismiss();
  }
//#endregion

}

