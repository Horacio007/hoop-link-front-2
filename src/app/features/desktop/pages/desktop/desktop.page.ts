import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.page.html',
  styleUrls: ['./desktop.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DesktopPage implements OnInit, OnDestroy {

//#region Propiedades
  private readonly _contextLog = 'DesktopPage';
//#endregion

//#region Constructor
  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _logger: LoggerService
  ) {
    effect(() => {
      const user = this._authService.user();
      const checked = this._authService.authChecked();

      if (!checked) return;

      if (!user) {
        this._logger.log(
          LogLevel.Warn,
          `${this._contextLog} >> constructor`,
          'No hay usuario autenticado. Redirigiendo al login.'
        );

        this._router.navigate(['/login']);
        return;
      }

      this._logger.log(
        LogLevel.Info,
        `${this._contextLog} >> constructor`,
        `Usuario autenticado detectado`,
        { rol: user.rol, correo: user.correo }
      );

      if (user.rol.includes('coach')) {
        user.rol = 'coach'
      } else {
        // console.warn('llego al else');
      }

      switch (user.rol) {
        case 'jugador':
          this._logger.log(
            LogLevel.Info,
            `${this._contextLog} >> constructor`,
            'Redirigiendo al escritorio de jugador.'
          );

          this._router.navigate(['/desktop/jugador']);
          break;
        case 'coach':
          this._logger.log(
            LogLevel.Info,
            `${this._contextLog} >> constructor`,
            'Redirigiendo al escritorio de coach.'
          );

          this._router.navigate(['/desktop/coach']);
          break;
        case 'admin':
          this._logger.log(
            LogLevel.Info,
            `${this._contextLog} >> constructor`,
            'Redirigiendo al escritorio de administrador.'
          );

          this._router.navigate(['/desktop/admin']);
          break;
        default:
          this._logger.log(
            LogLevel.Warn,
            `${this._contextLog} >> constructor`,
            `Rol desconocido: ${user.rol}. Redirigiendo a access-denied.`
          );

          this._router.navigate(['/access-denied']);
      }
    });
  }
//#endregion

//#region Metodos Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

}
