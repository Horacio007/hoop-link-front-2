import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonInput, IonDatetime, IonNote, IonLabel, IonDatetimeButton, IonModal, IonItem, IonList, IonProgressBar, IonCheckbox, IonButton } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/layouts/public-layout/components/header/header.component';
import { FooterComponent } from 'src/app/layouts/components/footer/footer.component';
import { ViewWillEnter  } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { LogLevel, SeverityMessageType } from 'src/app/core/enums';
import { IResponse } from 'src/app/core/interfaces/response/response.interface';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { ICatalogo } from 'src/app/shared/interfaces/catalogo/catalogo.interface';
import { IRegistro } from 'src/app/shared/interfaces/usuario/registro.interface';
import { CatalogoService } from 'src/app/shared/services/catalogo/catalogo.service';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { edadMinimaValidator, correoElectronicoValidator, contraseniaFuerteValidator, edadSegunTipoUsuarioValidator } from 'src/app/shared/validators';
import { addIcons } from 'ionicons';
import { calendarOutline, chevronDownOutline } from 'ionicons/icons';
import { SelectListSearchComponent } from "src/app/shared/components/ionic/select-list-search/select-list-search.component";

import { BlockUiService } from 'src/app/core/services/blockUI/block-ui.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';

import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';

@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.page.html',
  styleUrls: ['./formulario-registro.page.scss'],
  standalone: true,
  imports: [IonButton, IonCheckbox, IonProgressBar, IonList, IonDatetimeButton, IonLabel, IonItem, IonModal, IonNote, IonDatetime, IonInput, IonCardContent, IonCard, IonContent, CommonModule, FormsModule, HeaderComponent, FooterComponent, ReactiveFormsModule, SelectListSearchComponent, RouterModule, MaskitoDirective]
})
export class FormularioRegistroPage implements OnInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  public allTipoUsuario: ICatalogo[] = [];
  public allEstados: ICatalogo[] = [];
  public allMunicipios: ICatalogo[] = [];
  public aceptoTerrminos: boolean = false;
  public formulario: FormGroup;
  public hoy:Date = new Date();
  public hoyFormatoISO: string = this.hoy.toISOString();

  private readonly _contextLog = 'FormularioRegistroComponent';
  private _destroy$ = new Subject<void>();

  @ViewChild('datetimeFC') datetimeFC: any;
  public fechaValida: boolean = false;

  @ViewChild('modalEstados', { static: true }) modalEstado!: IonModal;
  public selectedEstadoNombre: string = 'Selecciona El Estado';
  public selectedEstadoId: string | undefined = undefined;
  public estadoValido: boolean = false;

  @ViewChild('modalMunicipios', { static: true }) modalMunicipio!: IonModal;
  public selectedMunicipioNombre: string = 'Selecciona El Municipio';
  public selectedMunicipioId: string | undefined = undefined;
  public municipioValido: boolean = false;

  @ViewChild('modalTipoUsuario', { static: true }) modalTipoUsuario!: IonModal;
  public selectedTipoUsuarioNombre: string = 'Selecciona El Tipo Usuario';
  public selectedTipoUsuarioId: string | undefined = undefined;
  public tipoUsuarioValido: boolean = false;

  public mostrarRequisitos: boolean = false;
  public progressValue: number = 0; // Para el valor de la barra (0.0 a 1.0)
  public strengthText: string = 'Inicia a escribir'; // Para el texto (Débil, Media, etc.)
  public strengthColor: string = 'medium'; // Para el color de la barra (rojo, amarillo, verde)

  readonly phoneMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => {
    const input = el as unknown as HTMLIonInputElement;
    return input.getInputElement();
  };

//#endregion Propiedades

//#endregion Constructor
  constructor(
    private readonly catalagoService: CatalogoService, private readonly usuarioService:UsuarioService,
    private readonly _formularioUtiuls:FormularioUtilsService, private fb: FormBuilder,
    private readonly router:Router, private readonly _logger: LoggerService,
    private _blockUiService: BlockUiService, private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {
    this.formulario = this.fb.group({
      nombre: new FormControl('', Validators.required),
      apellidoPaterno: new FormControl('', Validators.required),
      apellidoMaterno: new FormControl('', Validators.required),
      fechaNacimiento: new FormControl(Date(), {
        validators: [Validators.required, edadMinimaValidator(12)]
      }),
      estado: new FormControl('', Validators.required),
      municipio: new FormControl({value: '', disabled: true}, Validators.required),
      residencia: new FormControl('', Validators.required),
      correo: new FormControl('', {
        validators: [Validators.required, correoElectronicoValidator()]
      }),
      telefono: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]),
      tipoUsuario: new FormControl('', {
        validators: [Validators.required]
      }),
      contrasena: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8), contraseniaFuerteValidator()]
      }),
      aceptaTerminos: new FormControl(false, Validators.requiredTrue)
      },{ validators: edadSegunTipoUsuarioValidator() }
    );

    addIcons({
      calendarOutline, chevronDownOutline
    });

    // En tu constructor o ngOnInit()
    this.formulario.get('contrasena')?.valueChanges
    .pipe(
      // Opcional: para evitar calcular la fortaleza con demasiada frecuencia
      debounceTime(100)
    )
    .subscribe(() => {
      this.calcularFortaleza();
    });

  }
//#endregion Constructor

//#region Ng
  async ngOnInit(): Promise<void> {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
    // await this.inicializa();
    await this.cargarCatalogos();
  }

  ionViewWillEnter(): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ionViewWillEnter`, 'La vista está a punto de entrar (cargando datos).');
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion Ng

//#region Generales
  async cargarCatalogos() {
    // 1. INICIAR CARGA GLOBAL
    this._blockUiService.show('Iniciando carga de catálogos...');

    try {
      // --- 2. Cargar Catálogo de Estados ---
      this._blockUiService.updateMessage('Cargando catálogo de Estados...');

      // Carga secuencial 1
      const estados = await firstValueFrom(this.catalagoService.getAllEstado());
      this.allEstados = estados;
      // console.log('Estados cargados con éxito.');

      // --- 3. Cargar Tipos de Usuario ---
      this._blockUiService.updateMessage('Cargando catálogo de Tipos de Usuario...');

      // Carga secuencial 2
      const tiposUsuario = await firstValueFrom(this.catalagoService.getAllTipoUsuario());
      this.allTipoUsuario = tiposUsuario;
      // console.log('Tipos de usuario cargados con éxito.');

      // 4. Éxito total
      this._blockUiService.updateMessage('✅ Catálogos cargados exitosamente.');
      await new Promise(resolve => setTimeout(resolve, 500)); // Pequeña pausa para ver el mensaje de éxito
    } catch (error) {
      // 5. MANEJO DE ERRORES CENTRALIZADO

        // Actualiza el mensaje del loader con el error (si es un error conocido)
        const errorMessageUI = '❌ Error al cargar un catálogo.';
        const errorMessage = (error as any).message || '❌ Error desconocido al cargar un catálogo.';
        this._blockUiService.updateMessage(errorMessageUI);

        this._logger.log(LogLevel.Error, this._contextLog, errorMessage);

        // Opcional: Mostrar una alerta de error (ej: con ion-alert) o dejar el mensaje de error visible por 3 segundos
        await new Promise(resolve => setTimeout(resolve, 3000));
    } finally {
      // 6. FINALIZAR
      this._blockUiService.hide();
    }
  }

  // En tu componente .ts

  // El evento ahora solo necesita el ID, que es el valor de la selección única
  public async onCambiaEstado(event: string | undefined) {
    // 1. Validar la selección
    if (!event) {
        this.allMunicipios = [];
        this.formulario.controls['municipio'].disable();
        this.formulario.controls['municipio'].reset();
        return;
    }

    // 2. Mostrar el loader con mensaje dinámico
    this._blockUiService.show('Cargando municipios...');

    try {
        // 3. Realizar la petición de forma asíncrona
        const municipios = await firstValueFrom(
            this.catalagoService.getAllMunicipioByEstado(event)
        );

        // 4. ÉXITO: Procesar la respuesta
        this.allMunicipios = municipios;
        this.formulario.controls['municipio'].enable();

        // Opcional: limpiar la selección anterior de municipio si no es válida
        // if (municipios.length > 0 && this.formulario.controls['municipio'].value) {
        //     // ... lógica para validar el municipio seleccionado
        // } else {
            this.formulario.controls['municipio'].reset();
        // }

        this._logger.log(LogLevel.Debug, 'onCambiaEstado', 'Datos de municipio recibidos', municipios);

    } catch (error) {
        // 5. ERROR: Manejar la falla
        this.allMunicipios = []; // Vaciar la lista
        this.formulario.controls['municipio'].disable();
        this.formulario.controls['municipio'].reset();

        this._logger.log(LogLevel.Error, 'onCambiaEstado', 'Error cargando municipios', error);

        // Mostrar error en la UI (ej. Toast)
        this._blockUiService.updateMessage('❌ Error al cargar municipios.');
        // Opcional: dejar el mensaje visible por 2 segundos
        await new Promise(resolve => setTimeout(resolve, 2000));

    } finally {
        // 6. OCULTAR LOADER
        this._blockUiService.hide();
    }
  }

  public async guardar() {
    if(this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    } else if (this.formulario.valid) {
      console.log('entro aca al guardar');
      this._formularioUtiuls.aplicaTrim(this.formulario);
      const registro = this.formulario.value as IRegistro;
      this._blockUiService.show('Registrando Información...');
      this.usuarioService.save(registro)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response:IResponse<any>) => {
          this._logger.log(LogLevel.Debug, `${this._contextLog} >> guardar`, 'Registro almacenado.', response);
          this._toastService.showMessage(SeverityMessageType.Success, 'Genial', response.mensaje);
          this.formulario.controls['fechaNacimiento'].setValue(this.hoyFormatoISO); // O el valor que desees por defecto.

          this.formulario.reset();
          this.formulario.markAsUntouched();
          this.formulario.markAsPristine();
          this.selectedEstadoNombre = 'Selecciona El Estado';
          this.selectedMunicipioNombre = 'Selecciona El Municipio';
          this.selectedTipoUsuarioNombre = 'Selecciona El Tipo Usuario';
          this.datetimeFC.value = this.hoyFormatoISO;
          this.fechaValida = false;

          this._cdr.detectChanges();

          this.usuarioService.esRegistro = true;
          this.router.navigateByUrl('/portal');
          // setTimeout(() => {
          // }, 50); // 50ms (milisegundos) suelen ser suficientes
        },
        error: (error) => {
          this._logger.log(LogLevel.Error, `${this._contextLog} >> guardar`, 'Error al guardar', error);
          this._toastService.showMessage(SeverityMessageType.Error, 'Error', error.error.message);
          this._blockUiService.hide();
        },
        complete:() => {
          this._logger.log(LogLevel.Info, `${this._contextLog} >> guardar`, 'Petición terminada');
          this._blockUiService.hide();
        }
      });
    }
  }

  public esValido(campo: string):boolean| null {
    return this._formularioUtiuls.esCampoValido(this.formulario, campo);
  }

  public getErrores(campo: string, nombreMostrar:string):string | null {
    const errores = this._formularioUtiuls.getCampoError(this.formulario, campo, nombreMostrar);
    return errores;

  }

  public onChangeCalendar(event: any) {
    this.formulario.get('fechaNacimiento')?.setValue(event.detail.value);
    this.formulario.get('fechaNacimiento')?.markAsTouched();

    if (this.esValido('fechaNacimiento')) {
      this.fechaValida = true;
    }

  }

  public onClosesCalendar(event: any) {
    console.log('entre', event);
    this.formulario.get('fechaNacimiento')?.markAsTouched();

    if (this.esValido('fechaNacimiento')) {
      this.fechaValida = true;
    }

  }

  /**
   * Maneja el cambio de selección del estado (un solo ID)
   * @param event El ID seleccionado (string) o undefined/null si se deseleccionó.
   */
  public estadoSelectionChanged(selectedId: string | undefined) {
    // 1. Almacenar el ID seleccionado
    this.selectedEstadoId = selectedId;

    // 2. Buscar el nombre para mostrarlo en la UI (UX)
    const estadoSeleccionado = this.allEstados.find(e => e.id === selectedId);

    // 3. Actualizar la variable de la UI
    if (estadoSeleccionado) {
        this.selectedEstadoNombre = estadoSeleccionado.nombre;
        const estado: ICatalogo = {
          id: this.selectedEstadoId!,
          nombre: this.selectedEstadoNombre
        };

        this.formulario.controls['estado'].setValue(estado);
        this.formulario.controls['estado'].markAsTouched();


        this.onCambiaEstado(this.selectedEstadoId);
    } else {
      this.selectedEstadoNombre = 'Selecciona El Estado';
      this.formulario.controls['estado'].markAsTouched();

      if (this.esValido('estado')) {
        this.estadoValido = true;
      }
    }

    // 4. Cerrar el modal
    this.modalEstado.dismiss();
  }

  public estadoCancel() {
    this.formulario.get('estado')?.markAsTouched();

    if (this.esValido('estado')) {
      this.estadoValido = true;
    }

    this.modalEstado.dismiss();
  }

  public municipioSelectionChanged(selectedId: string | undefined) {
    // 1. Almacenar el ID seleccionado
    this.selectedMunicipioId = selectedId;

    // 2. Buscar el nombre para mostrarlo en la UI (UX)
    const municipioSeleccionado = this.allMunicipios.find(e => e.id === selectedId);

    // 3. Actualizar la variable de la UI
    if (municipioSeleccionado) {
        this.selectedMunicipioNombre = municipioSeleccionado.nombre;

         const municipio: ICatalogo = {
          id: this.selectedMunicipioId!,
          nombre: this.selectedMunicipioNombre
        };

        this.formulario.controls['municipio'].setValue(municipio);
        this.formulario.controls['municipio'].markAsTouched();
    } else {
        this.selectedMunicipioNombre = 'Selecciona El Municipio';
        this.formulario.controls['municipio'].markAsTouched();
        if (this.esValido('municipio')) {
          this.municipioValido = true;
        }
    }

    // 4. Cerrar el modal
    this.modalMunicipio.dismiss();
  }

  public municipioCancel() {
    this.formulario.get('municipio')?.markAsTouched();

    if (this.esValido('municipio')) {
      this.municipioValido = true;
    }

    this.modalMunicipio.dismiss();
  }

  public limpiarNumero(event: any) {
    // Asegúrate de que solo queden dígitos
    let valorLimpio = event.target.value.replace(/\D/g, '');
    this.formulario.get('telefono')?.setValue(valorLimpio, {
      emitEvent: false
    });
    // Actualizar el valor en el input si es necesario (depende de tu framework)
    event.target.value = valorLimpio;
}

  public tipoUsuarioSelectionChanged(selectedId: string | undefined) {
    // 1. Almacenar el ID seleccionado
    this.selectedTipoUsuarioId = selectedId;

    // 2. Buscar el nombre para mostrarlo en la UI (UX)
    const tipoUsuarioSeleccionado = this.allTipoUsuario.find(e => e.id === selectedId);

    // 3. Actualizar la variable de la UI
    if (tipoUsuarioSeleccionado) {
        this.selectedTipoUsuarioNombre = tipoUsuarioSeleccionado.nombre;

         const tipoUsuario: ICatalogo = {
          id: this.selectedTipoUsuarioId!,
          nombre: this.selectedTipoUsuarioNombre
        };

        this.formulario.controls['tipoUsuario'].setValue(tipoUsuario);
        this.formulario.controls['tipoUsuario'].markAsTouched();
    } else {
        this.selectedTipoUsuarioNombre = 'Selecciona El Tipo Usuario';
        this.formulario.controls['tipoUsuario'].markAsTouched();
        if (this.esValido('tipoUsuario')) {
          this.tipoUsuarioValido = true;
        }
    }

    // 4. Cerrar el modal
    this.modalTipoUsuario.dismiss();
  }

  public tipoUsuarioCancel() {
    this.formulario.get('tipoUsuario')?.markAsTouched();

    if (this.esValido('tipoUsuario')) {
      this.tipoUsuarioValido = true;
    }

    this.modalTipoUsuario.dismiss();
  }

  // Método para mostrar la sección cuando el input recibe el foco
  public onPasswordFocus() {
    this.mostrarRequisitos = true;
  }

  // Método para ocultar la sección cuando el input pierde el foco
  // Puedes añadir un pequeño retraso si es necesario para que el usuario
  // pueda hacer clic en los mensajes de error (aunque es raro en formularios móviles).
  public onPasswordBlur() {
    this.mostrarRequisitos = false;
  }

  get passwordControl() {
    return this.formulario.get('contrasena');
  }

  // -------------------------------------------------------------
  // FUNCIÓN PRINCIPAL DE CÁLCULO
  // -------------------------------------------------------------
  public calcularFortaleza() {
    const control = this.passwordControl;

    if (!control || !control.value) {
      this.progressValue = 0;
      this.strengthText = 'Inicia a escribir';
      this.strengthColor = 'medium'; // Un color neutro como gris
      return;
    }

    const password = control.value;
    let score = 0;

    // Verifica cada uno de los 4 requisitos (cada uno suma 1 punto al score)
    if (/[a-z]/.test(password)) score++;        // Letra minúscula
    if (/[A-Z]/.test(password)) score++;        // Letra mayúscula
    if (/\d/.test(password)) score++;           // Número
    if (password.length >= 8) score++;          // Mínimo 8 caracteres

    // 1. Calcular el valor de la barra (0.0 a 1.0)
    this.progressValue = score / 4;

    // 2. Determinar el texto de fortaleza y el color
    if (score === 4) {
      this.strengthText = 'Fuerte';
      this.strengthColor = 'success'; // Color verde de Ionic
    } else if (score >= 2) {
      this.strengthText = 'Media';
      this.strengthColor = 'warning'; // Color amarillo de Ionic
    } else {
      this.strengthText = 'Débil';
      this.strengthColor = 'danger';  // Color rojo de Ionic
    }
  }

//#endregion Generales


}
