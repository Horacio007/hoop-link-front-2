import { Routes } from '@angular/router';

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
    path: '',
    redirectTo: '/portal',
    pathMatch: 'full',
  },
];
