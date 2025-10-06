import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NexusPortalComponent } from './components/nexus-portal/nexus-portal.component';
import { IndividualUpsertComponent } from './components/individual-upsert/individual-upsert.component';
import { FamilyUpsertComponent } from './components/family-upsert/family-upsert.component';
import { IndividualOptionsComponent } from './components/individual-options/individual-options.component';
import { IndividualLookupComponent } from './components/individual-lookup/individual-lookup.component';

export const routes: Routes = [
  {
    path: 'nexusportal',
    component: NexusPortalComponent
  },{
    path: 'individual-options',
    component: IndividualOptionsComponent
  },{
    path: 'individual-upsert',
    component: IndividualUpsertComponent
  },{
    path: 'individual-lookup',
    component: IndividualUpsertComponent
  },{
    path: 'family-upsert',
    component: FamilyUpsertComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }