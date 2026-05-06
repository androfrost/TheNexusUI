import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NexusPortalComponent } from './components/nexus-portal/nexus-portal.component';
import { IndividualUpsertComponent } from './components/individual-upsert/individual-upsert.component';
import { GroupUpsertComponent } from './components/group-upsert/group-upsert.component';
import { IndividualOptionsComponent } from './components/individual-options/individual-options.component';
import { IndividualLookupComponent } from './components/individual-lookup/individual-lookup.component';
import { LocationUpsertComponent } from './components/location-upsert/location-upsert.component';
import { OptionsComponent } from './components/options/options.component';

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
    component: IndividualLookupComponent
  },{
    path: 'group-upsert',
    component: GroupUpsertComponent
  },{
    path: 'location-upsert',
    component: LocationUpsertComponent
  },{
    path: 'options',
    component: OptionsComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }