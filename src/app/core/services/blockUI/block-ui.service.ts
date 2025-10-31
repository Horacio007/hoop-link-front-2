// src/app/core/services/block-ui/block-ui.service.ts
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class BlockUiService {
  // Almacena la referencia a la instancia del loading
  private loading: HTMLIonLoadingElement | null = null;

  constructor(
    private loadingCtrl: LoadingController,
    private sanitizer: DomSanitizer,
  ) {}

  /**
   * Muestra el overlay de carga con el mensaje personalizado.
   * @param mensaje El mensaje inicial a mostrar.
   */
  async show(mensaje: string = 'Cargando información...'): Promise<void> {
    if (this.loading) return;

    const loaderHTML = this.getLoaderHtml(mensaje);

    // Solución final: bypass y extracción de la cadena HTML pura
    const safeHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(loaderHTML);

    this.loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      // ¡Solución validada!
      message: (safeHtml as any).changingThisBreaksApplicationSecurity,
      spinner: null,
      backdropDismiss: false,
    });

    await this.loading.present();
  }

  /**
   * Oculta el overlay de carga.
   */
  async hide(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  /**
   * ACTUALIZACIÓN CLAVE: Cambia el mensaje del loader sin cerrarlo.
   * @param nuevoMensaje El nuevo mensaje a mostrar.
   */
  async updateMessage(nuevoMensaje: string): Promise<void> {
    if (this.loading) {
      const loaderHTML = this.getLoaderHtml(nuevoMensaje);
      const safeHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(loaderHTML);

      // La propiedad 'message' puede cambiarse en tiempo de ejecución
      this.loading.message = (safeHtml as any).changingThisBreaksApplicationSecurity;
    }
  }

  /**
   * Genera el HTML del loader, movido a una función auxiliar para reuso.
   */
  private getLoaderHtml(mensaje: string): string {
    return `
      <div class="centered-container">
        <div class="centered-content">
          <div class="loader2"></div>
          <div class="loader">${mensaje}</div>
        </div>
      </div>
    `;
  }
}
