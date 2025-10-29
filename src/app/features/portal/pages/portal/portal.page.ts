import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonImg, IonFooter, IonHeader, IonLabel, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonIcon, IonInput, ModalController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TipoSvg, LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { IResizeImg } from 'src/app/shared/interfaces/ui/ui.interface';
import { redibujaImg } from 'src/app/shared/utils/ui/responsive.util';
import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { basketballOutline, statsChartOutline, peopleOutline, phonePortraitOutline, chatbubblesOutline, trophyOutline, checkmarkOutline } from 'ionicons/icons';
import { FooterComponent } from 'src/app/layouts/components/footer/footer.component';
import { HeaderComponent } from 'src/app/layouts/public-layout/components/header/header.component';
import { ModalRegistroComponent } from "../../components/modal-registro/modal-registro.component";

@Component({
  selector: 'app-portal',
  templateUrl: './portal.page.html',
  styleUrls: ['./portal.page.scss'],
  standalone: true,
  imports: [IonInput, IonIcon, IonCardContent, IonCardTitle, IonCard, IonCardHeader, IonLabel, IonImg, IonContent, CommonModule, FormsModule, IonButton, FooterComponent, HeaderComponent]
})
export class PortalPage implements OnInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  public widthImg:string = "600";
  public tipoSvg = TipoSvg;
  public widthImageUnirse:string = '300px';
  public esVisibleDialog:boolean = false;

  private _imgWidht:IResizeImg = {
      limSuperior:600,
      limInferior:550,
      valSuperior:600,
      valInferior:480,
  };

  private readonly _contextLog = 'PortalPageComponent';
//#endregion

//#region Constructor
  constructor(
    private router: Router, private usuarioService: UsuarioService,
    private readonly _logger: LoggerService, private modalCtrl: ModalController
  ) {
    addIcons({
      basketballOutline, statsChartOutline, peopleOutline, phonePortraitOutline, chatbubblesOutline, trophyOutline, checkmarkOutline
    })

  }
//#endregion

//#region Ng
  ngOnInit(): void {
   this.inicializa();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
  }

  ionViewWillEnter() {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ionViewWillEnter`, 'La vista está a punto de entrar (cargando datos).');
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Listenners
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthImg = redibujaImg(this._imgWidht, 2);
  }
//#endregion

//#region Generales
  onClickUnirse() {
    this.router.navigateByUrl('/registro')
  }

  private inicializa() {
    this.defineTamanio();
    this.muestraEsRegistro();
  }

  private defineTamanio() {
    this.widthImg = redibujaImg(this._imgWidht, 2);
  }

  private muestraEsRegistro() {
    if (this.usuarioService.esRegistro) {
      // 🚀 CAMBIO: Si el servicio indica que debe mostrarse, llamamos a presentModal
      this.presentModal();
      this.usuarioService.esRegistro = false; // O la lógica para evitar que se muestre de nuevo
    }
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalRegistroComponent,
      cssClass: 'custom-modal-registro'
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

//#endregion

}
