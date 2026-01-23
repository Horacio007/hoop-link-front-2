import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { v4 as uuidv4 } from 'uuid';
import { SkeletonComponent } from "src/app/shared/components/ionic/skeleton/skeleton.component";
import { IonLabel, IonDatetimeButton, IonDatetime, IonModal, IonInput, IonItem, IonToggle, IonButton, IonIcon, IonCardSubtitle, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonHeader, IonToolbar, IonButtons, IonContent, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, trash } from 'ionicons/icons';

@Component({
  selector: 'app-jugador-experiencia',
  templateUrl: './jugador-experiencia.page.html',
  styleUrls: ['./jugador-experiencia.page.scss'],
  standalone: true,
  imports: [IonContent, IonButtons, IonToolbar, IonHeader, IonCardTitle, IonCardContent, IonCardHeader, IonCard, IonIcon, IonToggle, IonItem, IonInput, IonModal, IonDatetime, IonDatetimeButton, IonLabel, CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, IonButton]
})
export class JugadorExperienciaPage implements OnInit, OnDestroy, AfterViewInit {

//#region Propiedades
  @Input({required: true}) form!: FormGroup;
  @Input({required: true}) cargandoData: boolean = true;
  public iconoSi: string = "pi pi-check";

  @Input({required: true }) isReadOnly: boolean = false;

  @ViewChild('datetimeFC') datetimeFC!: IonDatetime;
  public hoy:Date = new Date();
  public hoyFormatoISO: string = this.hoy.toISOString();

  private readonly _contextLog = 'JugadorExperienciaPage';

  @ViewChild('modalGenerales', { static: true }) modalGenerales!: IonModal;
  @ViewChild('modalTrayectoria', { static: true }) modalTrayectoria!: IonModal;
  @ViewChild('modalLogros', { static: true }) modalLogros!: IonModal;
//#endregion

//#region Constructor
  constructor(
    private readonly _formularioUtils: FormularioUtilsService, private readonly _fb: FormBuilder,
    private readonly _logger: LoggerService,
  ) {

    addIcons({
      addCircleOutline, trash
    });

  }
//#endregion

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
    setTimeout(() => {
      this.setPernecesClubInicial();
    }, 0);
    if (this.isReadOnly) {
      this.form.disable()
    }
  }

  ngAfterViewInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngAfterViewInit`, 'Componente vista inicializado.');
    this.setDesdeCuandoJuegasInicial();
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales

  private setPernecesClubInicial(): void {
    const control = this.form.get('pertenecesClub');
    const initialValue = control?.value; // Puede ser boolean, string, null, o undefined

      let finalBooleanValue: boolean | null = null;

      // 1. Determinar el valor booleano final
    if (typeof initialValue === 'string') {
      // Convierte la cadena ('true' o 'false') a booleano
      finalBooleanValue = initialValue === 'true';
    } else if (typeof initialValue === 'boolean') {
      // Si ya es booleano (el caso que te llega del backend), lo usa directamente
      finalBooleanValue = initialValue;
    }

      // 2. Aplicar el valor de forma segura con setTimeout
    if (finalBooleanValue !== null) {
      // Utilizamos setTimeout para asegurar que el DOM (ion-toggle)
          // se actualice en el siguiente ciclo de detección de cambios (next tick).
      setTimeout(() => {
        control?.setValue(finalBooleanValue!, { emitEvent: false });
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> setManoJuegoInicial`, `Valor inicial establecido a booleano: ${finalBooleanValue}`);
      }, 0);
    } else if (initialValue !== null && initialValue !== undefined) {
          // Log para valores inesperados
    }
  }

  private setDesdeCuandoJuegasInicial(): void {
    if (this.datetimeFC && this.form.get('desdeCuandoJuegas')?.value) {
      const valorISO = new Date(this.form.get('desdeCuandoJuegas')?.value).toISOString();

      // 2. **Setear el valor** en la propiedad 'value' del IonDatetime.
      this.datetimeFC.value = valorISO;
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> setDesdeCuandoJuegasInicial`, `Valor de IonDatetime seteado a ISO: ${valorISO}`);
    }
  }

  public onChangeCalendar(event: any) {
    this.form.get('desdeCuandoJuegas')?.setValue(event.detail.value);
    this.form.get('desdeCuandoJuegas')?.markAsTouched();
  }

  public onClosesCalendar(event: any) {
    this.form.get('desdeCuandoJuegas')?.markAsTouched();
  }

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

  get Equipo(): FormArray {
    return this.form.get('historialEquipos') as FormArray;
  }

  get Entrenadores(): FormArray {
    return this.form.get('historialEntrenadores') as FormArray;
  }

  get Logros(): FormArray {
    return this.form.get('logrosClave') as FormArray;
  }

  public esValidoEquipo(index: number, campo: string): boolean {
    const control = this.Equipo.at(index).get(campo);
    return control?.invalid && (control?.touched || control?.dirty) || false;
  }

  public getErroresEquipo(index: number, campo: string, nombreMostrar: string): string | null {
    const control = this.Equipo.at(index);
    return this._formularioUtils.getCampoError(control, campo, nombreMostrar);
  }

  public esValidoEntrenadores(index: number, campo: string): boolean {
    const control = this.Entrenadores.at(index).get(campo);
    return control?.invalid && (control?.touched || control?.dirty) || false;
  }

  public getErroresEntrenadores(index: number, campo: string, nombreMostrar: string): string | null {
    const control = this.Entrenadores.at(index);
    return this._formularioUtils.getCampoError(control, campo, nombreMostrar);
  }

  public esValidoLogros(index: number, campo: string): boolean {
    const control = this.Logros.at(index).get(campo);
    return control?.invalid && (control?.touched || control?.dirty) || false;
  }

  public getErroresLogros(index: number, campo: string, nombreMostrar: string): string | null {
    const control = this.Logros.at(index);
    return this._formularioUtils.getCampoError(control, campo, nombreMostrar);
  }

  private crearFormularioEquipos(): FormGroup {
    const grupo = this._fb.group({
      id: [uuidv4()],
      nombre: ['', Validators.required],
    });

    return grupo;
  }

  private crearFormularioEntrenadores(): FormGroup {
    const grupo = this._fb.group({
      id: [uuidv4()],
      nombre: ['', Validators.required],
    });

    return grupo;
  }

  private crearFormularioLogros(): FormGroup {
    const grupo = this._fb.group({
      id: [uuidv4()],
      nombre: ['', Validators.required],
    });

    return grupo;
  }

  public onAgregaEquipo() {
    this.Equipo.push(this.crearFormularioEquipos());
  }

  public onEliminaEquipo(index: number): void {
    this.Equipo.removeAt(index);
  }

  public onAgregaEntrenadores() {
    this.Entrenadores.push(this.crearFormularioEntrenadores());
  }

  public onEliminaEntrenadores(index: number): void {
    this.Entrenadores.removeAt(index);
  }

  public onAgregaLogros() {
    this.Logros.push(this.crearFormularioLogros());
  }

  public onEliminaLogros(index: number): void {
    this.Logros.removeAt(index);
  }


  public openModalGenerales() {
    this.modalGenerales.present();
  }

  public closeModalGenerales() {
    this.modalGenerales.dismiss();
  }

  public openModalTrayectoria() {
    this.modalTrayectoria.present();
  }

  public closeModalTrayectoria() {
    this.modalTrayectoria.dismiss();
  }

  public openModalLogros() {
    this.modalLogros.present();
  }

  public closeModalLogros() {
    this.modalLogros.dismiss();
  }
//#endregion

}
