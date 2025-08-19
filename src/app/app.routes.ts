import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NexusPortalComponent } from './components/nexus-portal/nexus-portal.component';

export const routes: Routes = [
    {
    path: 'nexusportal',
    component: NexusPortalComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }