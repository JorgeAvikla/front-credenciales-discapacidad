import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';
import { isAuthenticatedGuard } from '../auth/guards/isAuthenticated.guard';
import { PruebasComponent } from './pages/pruebas/pruebas.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'nuevo',
        canActivate: [isAuthenticatedGuard],
        component: NewPageComponent
      },
      {
        path: 'lista',
        canActivate: [isAuthenticatedGuard],
        component: ListPageComponent
      },
      {
        path: 'prueba',
        canActivate: [isAuthenticatedGuard],
        component: PruebasComponent
      },
      {
        path: 'usuario/:id',
        // canActivate: [isAuthenticatedGuard],
        component: UsuarioPageComponent
      },
      { path: '**', redirectTo: 'lista' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
