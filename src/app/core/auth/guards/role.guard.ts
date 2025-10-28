import { inject } from '@angular/core';
import { CanActivateFn, CanLoadFn, Router, ActivatedRouteSnapshot, Route, UrlSegment, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { combineLatest, of } from 'rxjs';
import { filter, take, map, catchError } from 'rxjs/operators';
import { LoggerService } from '../../services/logger/logger.service';
import { LogLevel } from '../../enums';


export const roleGuard: CanActivateFn & CanLoadFn = (route: ActivatedRouteSnapshot | Route, stateOrSegments?: RouterStateSnapshot | UrlSegment[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  // Determinar la URL o ruta para logging
  let currentRoute = 'desconocida';
  if (stateOrSegments && 'url' in stateOrSegments) {
    // CanActivate
    currentRoute = stateOrSegments.url;
  } else if (Array.isArray(stateOrSegments)) {
    // CanLoad
    currentRoute = (route as Route).path || 'desconocida';
  } else if ('path' in route) {
    currentRoute = route.path || 'desconocida';
  }

  logger.log(LogLevel.Debug, 'RoleGuard', `Guard ejecutado para ruta: ${currentRoute}`);

  // Obtén el rol esperado desde data.role (para CanLoad puede ser undefined)
  const expectedRole = (route as ActivatedRouteSnapshot | Route).data?.['role'] as string | undefined;

  return combineLatest([authService.user$, authService.authChecked$]).pipe(
    filter(([_, checked]) => checked), // Espera hasta que authChecked sea true
    take(1),
    map(([user]) => {
      if (!user) {
        logger.log(LogLevel.Warn, 'RoleGuard', 'Usuario no autenticado, redirigiendo a /login');
        return router.parseUrl('/login');
      }

      if (expectedRole && user.rol !== expectedRole) {
        logger.log(
          LogLevel.Warn,
          'RoleGuard',
          `Usuario autenticado pero sin rol correcto. Rol esperado: ${expectedRole}, rol actual: ${user.rol}. Redirigiendo a /access-denied`
        );
        return router.parseUrl('/access-denied');
      }

      logger.log(LogLevel.Info, 'RoleGuard', 'Acceso permitido para usuario autenticado con rol correcto');
      return true;
    }),
    catchError((err) => {
      logger.log(LogLevel.Error, 'RoleGuard', 'Error verificando rol de usuario', err);
      return of(router.parseUrl('/login'));
    })
  );
};
