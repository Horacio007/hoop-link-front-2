import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonInput, IonDatetime, IonNote, IonLabel, IonDatetimeButton, IonModal, IonItem, IonList } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/layouts/public-layout/components/header/header.component';
import { FooterComponent } from 'src/app/layouts/components/footer/footer.component';
import { ViewWillEnter  } from '@ionic/angular';
import { Router } from '@angular/router';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { LogLevel } from 'src/app/core/enums';
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

@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.page.html',
  styleUrls: ['./formulario-registro.page.scss'],
  standalone: true,
  imports: [IonList, IonDatetimeButton, IonLabel, IonItem, IonModal, IonNote, IonDatetime, IonInput, IonCardContent, IonCard, IonContent, CommonModule, FormsModule, HeaderComponent, FooterComponent, ReactiveFormsModule, SelectListSearchComponent]
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
  // public estadoSeleccionado: boolean = false;

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
//#endregion Propiedades

//#endregion Constructor
  constructor(
    private readonly catalagoService: CatalogoService, private readonly usuarioService:UsuarioService,
    private readonly _formularioUtiuls:FormularioUtilsService, private fb: FormBuilder,
    private readonly router:Router, private readonly _logger: LoggerService,
    private _blockUiService: BlockUiService,
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
      telefono: new FormControl('', Validators.required),
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
        const errorMessage = (error as any).message || '❌ Error desconocido al cargar un catálogo.';
        this._blockUiService.updateMessage(errorMessage);

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

  public guardar(): void {
    if(this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    } else if (this.formulario.valid) {
      this._formularioUtiuls.aplicaTrim(this.formulario);
      const registro = this.formulario.value as IRegistro;
      // this.blockUserIService.show('Registrando Información...');
      this.usuarioService.save(registro)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response:IResponse<any>) => {
          this._logger.log(LogLevel.Debug, `${this._contextLog} >> guardar`, 'Registro almacenado.', response);
          // this._toastService.showMessage(SeverityMessageType.Success, 'Genial', response.mensaje, undefined, 5000);
          this.formulario.reset();
          // this.blockUserIService.hide();
          this.usuarioService.esRegistro = true;
          this.router.navigateByUrl('/portal');
        },
        error: (error) => {
          this._logger.log(LogLevel.Error, `${this._contextLog} >> guardar`, 'Error al guardar', error);
          // this._toastService.showMessage(SeverityMessageType.Error, 'Error', error.error.message);
          // this.blockUserIService.hide();
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
  estadoSelectionChanged(selectedId: string | undefined) {
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

  estadoCancel() {
    this.formulario.get('estado')?.markAsTouched();

    if (this.esValido('estado')) {
      this.estadoValido = true;
    }

    this.modalEstado.dismiss();
  }

  municipioSelectionChanged(selectedId: string | undefined) {
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



//#endregion Generales


}
