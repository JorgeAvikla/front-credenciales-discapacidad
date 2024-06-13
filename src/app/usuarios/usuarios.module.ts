import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PruebasComponent } from './pages/pruebas/pruebas.component';



@NgModule({
  declarations: [
    UsuarioPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    NewPageComponent,
    PruebasComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
