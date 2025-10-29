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
    ]
  }
];
