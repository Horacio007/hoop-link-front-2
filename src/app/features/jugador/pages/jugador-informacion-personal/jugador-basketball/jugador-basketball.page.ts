import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonModal, IonLabel, IonDatetimeButton, IonDatetime, IonSegment, IonSegmentButton, IonList, IonItem, IonRadio, IonToggle, IonInput, IonCardSubtitle, IonCardHeader, IonCardTitle, IonCard, IonContent, IonIcon, IonCardContent, IonHeader, IonToolbar, IonButton, IonButtons, IonText } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ICatalogo } from 'src/app/shared/interfaces/catalogo/catalogo.interface';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { SkeletonComponent } from 'src/app/shared/components/ionic/skeleton/skeleton.component';
import { SelectListSearchComponent } from "src/app/shared/components/ionic/select-list-search/select-list-search.component";

@Component({
  selector: 'app-jugador-basketball',
  templateUrl: './jugador-basketball.page.html',
  styleUrls: ['./jugador-basketball.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonToolbar, IonHeader, IonCardContent, IonIcon, IonContent, IonCard, IonCardTitle, IonCardHeader, IonInput, IonToggle, IonItem, IonList, IonDatetime, IonDatetimeButton, IonLabel, CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, IonModal, SelectListSearchComponent]
})
export class JugadorBasketballPage implements OnInit, OnDestroy, AfterViewInit {

//#region Propiedades
  @Input({required: true}) form!: FormGroup;
  @Input({required: true}) cargandoData: boolean = true;
  @Input({required: true}) allPosicionJugador!: ICatalogo[] | undefined;
  @Input({required: true }) isReadOnly: boolean = false;

  public iconoSi: string = "fa-solid fa-hand-point-left";
  public iconoSi2: string = "pi pi-check";

  private readonly _contextLog = 'JugadorBasketballPage';
  private _destroy$ = new Subject<void>();

  @ViewChild('datetimeFC') datetimeFC!: IonDatetime;
  public hoy:Date = new Date();
  public hoyFormatoISO: string = this.hoy.toISOString();

  @ViewChild('modalPosicionUno', { static: true }) modalPosicionUno!: IonModal;
  public selectedPosicionUnoNombre: string = 'Selecciona Posición Uno';
  public selectedPosicionUnoId: string | undefined = undefined;
  public posicionUnoValido: boolean = false;

  @ViewChild('modalPosicionDos', { static: true }) modalPosicionDos!: IonModal;
  public selectedPosicionDosNombre: string = 'Selecciona Posición Dos';
  public selectedPosicionDosId: string | undefined = undefined;
  public posicionDosValido: boolean = false;

  @ViewChild('modalDatosGenerales', { static: true }) modalDatosGenerales!: IonModal;
  @ViewChild('modalEstadisticas', { static: true }) modalEstadisticas!: IonModal;
  @ViewChild('modalEficiencia', { static: true }) modalEficiencia!: IonModal;
//#endregion

//#region Constructor
  constructor(
    private readonly _formularioUtils: FormularioUtilsService, private readonly _logger: LoggerService,
  ) { }
//#endregion

//#region Ng
  ngOnInit() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
    setTimeout(() => {
      this.setValoresCatalogoPosicionUno(this.form.get('posicionJuegoUno')?.value);
      this.setValoresCatalogoPosicionDos(this.form.get('posicionJuegoDos')?.value);
      this.setManoJuegoInicial();
      this.setClavasInicial();
    }, 0);
    this.form.valueChanges.subscribe(val => {
    });
    if (this.isReadOnly) {
      this.form.disable()
    }
  }

  ngAfterViewInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngAfterViewInit`, 'Componente vista inicializado.');
    this.setAnioEmpezoAJugarInicial();
  }

  ngOnDestroy() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
    this._destroy$.next();
    this._destroy$.complete();
  }
//#endregion

//#region Generales

  private setManoJuegoInicial(): void {
    const control = this.form.get('manoJuego');
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

  private setClavasInicial(): void {
    const control = this.form.get('clavas');
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
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> setClavasInicial`, `Valor inicial establecido a booleano: ${finalBooleanValue}`);
      }, 0);
    } else if (initialValue !== null && initialValue !== undefined) {
          // Log para valores inesperados
    }
  }

  private setAnioEmpezoAJugarInicial(): void {
    if (this.datetimeFC && this.form.get('anioEmpezoAJugar')?.value) {
      const valorISO = new Date(this.form.get('anioEmpezoAJugar')?.value).toISOString();

      // 2. **Setear el valor** en la propiedad 'value' del IonDatetime.
      this.datetimeFC.value = valorISO;
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> setAnioEmpezoAJugarInicial`, `Valor de IonDatetime seteado a ISO: ${valorISO}`);
    }
  }

  private setValoresCatalogoPosicionUno(item: ICatalogo): void {
    if (item) {
      this.selectedPosicionUnoNombre = item.nombre.toString();
      this.selectedPosicionUnoId = item.id
    }
  }

  private setValoresCatalogoPosicionDos(item: ICatalogo): void {
    if (item) {
      this.selectedPosicionDosNombre = item.nombre.toString();
      this.selectedPosicionDosId = item.id
    }
  }

  public onChangeCalendar(event: any) {
    this.form.get('anioEmpezoAJugar')?.setValue(event.detail.value);
    this.form.get('anioEmpezoAJugar')?.markAsTouched();
  }

  public onClosesCalendar(event: any) {
    this.form.get('anioEmpezoAJugar')?.markAsTouched();
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

  public posicionUnoSelectionChanged(selectedId: string | undefined) {
    // 1. Almacenar el ID seleccionado
    this.selectedPosicionUnoId = selectedId;

    // 2. Buscar el nombre para mostrarlo en la UI (UX)
    const posicionSeleccionado = this.allPosicionJugador!.find(e => e.id === selectedId);

    // 3. Actualizar la variable de la UI
    if (posicionSeleccionado) {
      this.selectedPosicionUnoNombre = posicionSeleccionado.nombre;
      const estado: ICatalogo = {
        id: this.selectedPosicionUnoId!,
        nombre: this.selectedPosicionUnoNombre
      };

      this.form.controls['posicionJuegoUno'].setValue(estado);
      this.form.controls['posicionJuegoUno'].markAsTouched();
    } else {
      this.selectedPosicionUnoNombre = 'Selecciona La Posicion';
      this.form.controls['posicionJuegoUno'].markAsTouched();
    }

    // 4. Cerrar el modal
    this.modalPosicionUno.dismiss();
  }

  public posicionUnoCancel() {
    this.form.get('posicionJuegoUno')?.markAsTouched();

    this.modalPosicionUno.dismiss();
  }

   public openPosicionUnoModal() {
    // Aquí puedes preparar data o asegurar que el catálogo esté listo
    // (Ej. this.currentSelectedEstatus = this.form.get('estatusBusquedaJugador')?.value?.id;)

    // Abrir el modal manualmente
    this.modalPosicionUno.present();
  }

  public openPosicionDosModal() {
    // Aquí puedes preparar data o asegurar que el catálogo esté listo
    // (Ej. this.currentSelectedEstatus = this.form.get('estatusBusquedaJugador')?.value?.id;)

    // Abrir el modal manualmente
    this.modalPosicionDos.present();
  }

  public posicionDosSelectionChanged(selectedId: string | undefined) {
    // 1. Almacenar el ID seleccionado
    this.selectedPosicionDosId = selectedId;

    // 2. Buscar el nombre para mostrarlo en la UI (UX)
    const posicionSeleccionado = this.allPosicionJugador!.find(e => e.id === selectedId);

    // 3. Actualizar la variable de la UI
    if (posicionSeleccionado) {
        this.selectedPosicionDosNombre = posicionSeleccionado.nombre;
        const estado: ICatalogo = {
          id: this.selectedPosicionDosId!,
          nombre: this.selectedPosicionDosNombre
        };

        this.form.controls['posicionJuegoDos'].setValue(estado);
        this.form.controls['posicionJuegoDos'].markAsTouched();
    } else {
      this.selectedPosicionDosNombre = 'Selecciona La Posicion';
      this.form.controls['posicionJuegoDos'].markAsTouched();
    }

    // 4. Cerrar el modal
    this.modalPosicionDos.dismiss();
  }

  public posicionDosCancel() {
    this.form.get('posicionJuegoDos')?.markAsTouched();

    this.modalPosicionDos.dismiss();
  }

  public openModalDatosGenerales() {
    this.modalDatosGenerales.present();
  }

  public closeModalDatosGenerales() {
    this.modalDatosGenerales.dismiss();
  }

  public openModalEstadisticas() {
    this.modalEstadisticas.present();
  }

  public closeModalEstadisticas() {
    this.modalEstadisticas.dismiss();
  }

  public openModalEficiencia() {
    this.modalEficiencia.present();
  }

  public closeModalEficiencia() {
    this.modalEficiencia.dismiss();
  }
//#endregion

}

