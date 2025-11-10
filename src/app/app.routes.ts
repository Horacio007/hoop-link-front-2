import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';

export const routes: Routes = [
  {
    path: 'portal',
    title: 'Portal | HoopLink',
    loadComponent: () => import('./layouts/public-layout/public-portal-layout/public-portal-layout.page').then( m => m.PublicPortalLayoutPage),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/portal/pages/portal/portal.page').then( m => m.PortalPage)
      },
      {
        path: 'terminos-condiciones',
        title: 'Terminos y Condiciones | HoopLink',
        loadComponent: () => import('./features/portal/pages/terminos-condiciones/terminos-condiciones.page').then( m => m.TerminosCondicionesPage)
      }
    ]
  },
  {
    path: 'legal',
    title: 'Legal | HoopLink',
    loadComponent: () => import('./layouts/public-layout/public-legal-layout/public-legal-layout.page').then( m => m.PublicLegalLayoutPage),
    children: [
      {
        path: '',
        redirectTo: 'acerca-de',
        pathMatch: 'full'
      },
      {
        path: 'acerca-de',
        title: 'Acerca de | HoopLink',
        loadComponent: () => import('./features/legal/pages/acerca-de/acerca-de.page').then( m => m.AcercaDePage)
      },
      {
        path: 'condiciones-uso',
        title: 'Condiciones de Uso | HoopLink',
        loadComponent: () => import('./features/legal/pages/condiciones-uso/condiciones-uso.page').then( m => m.CondicionesUsoPage)
      },
      {
        path: 'politica-privacidad',
        title: 'Política de Privacidad | HoopLink',
        loadComponent: () => import('./features/legal/pages/politica-privacidad/politica-privacidad.page').then( m => m.PoliticaPrivacidadPage)
      },
      {
        path: 'politica-cookies',
        title: 'Política de Cookies | HoopLink',
        loadComponent: () => import('./features/legal/pages/politica-cookies/politica-cookies.page').then( m => m.PoliticaCookiesPage)
      },
      {
        path: 'politica-copyright',
        title: 'Política de Copyright | HoopLink',
        loadComponent: () => import('./features/legal/pages/politica-copyright/politica-copyright.page').then( m => m.PoliticaCopyrightPage)
      },
      {
        path: 'politica-marca',
        title: 'Política de Marca | HoopLink',
        loadComponent: () => import('./features/legal/pages/politica-marca/politica-marca.page').then( m => m.PoliticaMarcaPage)
      },
    ]
  },
  {
    path: 'registro',
    title: 'Registro | HoopLink',
    loadComponent: () => import('./layouts/public-layout/public-portal-layout/public-portal-layout.page').then( m => m.PublicPortalLayoutPage),
    children: [
      {
        path: '',
        redirectTo: 'formulario-registro',
        pathMatch: 'full'
      },
      {
        path: 'formulario-registro',
        title: 'Formulario Registro | HoopLink',
        loadComponent: () => import('./features/registro/pages/formulario-registro/formulario-registro.page').then( m => m.FormularioRegistroPage)
      },
      {
        path: 'valida-correo',
        title: 'Valida Correo | HoopLink',
        loadComponent: () => import('./features/registro/pages/valida-correo/valida-correo.page').then( m => m.ValidaCorreoPage)
      },
    ]
  },
  {
    path: 'login',
    title: 'Login | HoopLink',
    loadComponent: () => import('./layouts/public-layout/public-portal-layout/public-portal-layout.page').then( m => m.PublicPortalLayoutPage),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/login/pages/login/login.page').then( m => m.LoginPage)
      }
    ]
  },
  {
    canLoad: [authGuard],
    canActivate: [authGuard],
    path: 'desktop',
    title: 'Desktop | HoopLink',
    loadComponent: () => import('./layouts/authenticated-layout/authenticated-layout/authenticated-layout.page').then( m => m.AuthenticatedLayoutPage),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/desktop/pages/desktop/desktop.page').then( m => m.DesktopPage)
      },
      {
        path: 'jugador',
        canActivate: [roleGuard],
        canLoad: [roleGuard],
        data: { role: 'jugador' },
        title: 'Dashboard | HoopLink',
        loadComponent: () => import('./features/jugador/pages/jugador-dashboard/jugador-dashboard.page').then(l => l.JugadorDashboardPage),
        children: [
          {
            // 2. Ruta Hija Index (Carga el Contenido REAL del Dashboard)
            path: '',
            pathMatch: 'full',
            loadComponent: () => import('./features/jugador/pages/jugador-dashboard-index/jugador-dashboard-index.page').then(m => m.JugadorDashboardIndexPage)
          },
          {
            path: 'informacion-personal', // URL: /desktop/jugador/informacion-personal
            title: 'Información Personal | HoopLink',
            loadComponent: () => import('./features/jugador/pages/jugador-informacion-personal/jugador-informacion-personal.page').then(m => m.JugadorInformacionPersonalPage),
            children: [
              {
                path: 'jugador-perfil',
                loadComponent: () => import('./features/jugador/pages/jugador-informacion-personal/jugador-perfil/jugador-perfil.page').then( m => m.JugadorPerfilPage)
              },
              {
                path: 'jugador-fuerza-resistencia',
                loadComponent: () => import('./features/jugador/pages/jugador-informacion-personal/jugador-fuerza-resistencia/jugador-fuerza-resistencia.page').then( m => m.JugadorFuerzaResistenciaPage)
              },
              {
                path: 'jugador-basketball',
                loadComponent: () => import('./features/jugador/pages/jugador-informacion-personal/jugador-basketball/jugador-basketball.page').then( m => m.JugadorBasketballPage)
              },
              {
                path: 'jugador-experiencia',
                loadComponent: () => import('./features/jugador/pages/jugador-informacion-personal/jugador-experiencia/jugador-experiencia.page').then( m => m.JugadorExperienciaPage)
              },
            ]
          },
        ]
      },
    ]
  },
  {
    path: '',
    redirectTo: '/portal',
    pathMatch: 'full',
  },

];
