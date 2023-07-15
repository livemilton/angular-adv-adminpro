import { RouterModule, Routes } from "@angular/router";
import {NgModule} from '@angular/core';
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Grafica1Component } from "./grafica1/grafica1.component";
import { AccountsSettingsComponent } from "./accounts-settings/accounts-settings.component";


const routes: Routes = [

    {
        path:'dashboard', 
        component: PagesComponent,
        children: [
          {path: '', component: DashboardComponent},
          {path:'progress', component: ProgressComponent},
          {path:'grafica1', component: Grafica1Component},
          {path:'account-settings', component: AccountsSettingsComponent}
          
        ]
      },

];

@NgModule({
    imports:[ RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class PagesRoutingModule {}
