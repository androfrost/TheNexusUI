import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NexusPortalComponent } from './components/nexus-portal/nexus-portal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NexusPortalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TheNexusNG';
}
