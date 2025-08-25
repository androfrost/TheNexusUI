import { Component, EventEmitter, Output } from '@angular/core';
import { portal } from '../../enum/portal';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  portal = portal;

  @Output() goToNextPortal = new EventEmitter<number>();

  TraversePortal(portalId: number) : void{
    this.goToNextPortal.emit(portalId);
  }
}
