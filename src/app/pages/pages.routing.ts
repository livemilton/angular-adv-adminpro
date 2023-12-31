import { RouterModule, Routes } from "@angular/router";
import {NgModule} from '@angular/core';

import { AuthGuard } from "../guards/auth.guard";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Grafica1Component } from "./grafica1/grafica1.component";
import { AccountsSettingsComponent } from "./accounts-settings/accounts-settings.component";
import { PromesasComponent } from "./promesas/promesas.component";
import { RxjsComponent } from "./rxjs/rxjs.component";
import { PerfilComponent } from "./perfil/perfil.component";

//mantenimientos
import { UsuariosComponent } from "./mantenimientos/usuarios/usuarios.component";



const routes: Routes = [

    {
        path:'dashboard', 
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
          {path: '', component: DashboardComponent, data:{titulo : 'Dashboard'}},
          {path:'progress', component: ProgressComponent, data: {titulo: 'ProgressBar'}},
          {path:'grafica1', component: Grafica1Component, data: {titulo: 'Gráfica #1'}},
          {path:'account-settings', component: AccountsSettingsComponent, data: {titulo: 'Ajustes de cuenta'}},
          {path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'}},
          {path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'}},
          {path: 'perfil', component: PerfilComponent, data:{titulo: 'Perfil de usuario'}},

          //mantenimientos
          {path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Perfil de usuario'}},
        ]
      },

];

@NgModule({
    imports:[ RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class PagesRoutingModule {}
