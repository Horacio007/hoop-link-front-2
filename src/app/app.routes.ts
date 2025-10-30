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
    ]
  },
];
