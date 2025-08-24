import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NexusPortalComponent } from './components/nexus-portal/nexus-portal.component';
import { IndividualUpsertComponent } from './components/individual-upsert/individual-upsert.component';

export const routes: Routes = [
  {
    path: 'nexusportal',
    component: NexusPortalComponent
  },{
    path: 'individual-upsert',
    component: IndividualUpsertComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }