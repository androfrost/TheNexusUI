import { Component } from '@angular/core';
import { NexusPortalComponent } from './components/nexus-portal/nexus-portal.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NexusPortalComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TheNexusNG';
}
