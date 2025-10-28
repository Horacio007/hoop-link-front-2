import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'portal',
    title: 'Portal | HoopLink',
    loadComponent: () => import('./layouts/public-layout/public-portal-layout/public-portal-layout.component').then( m => m.PublicPortalLayoutComponent)
  },
];
