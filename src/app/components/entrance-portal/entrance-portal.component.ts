import { Component, EventEmitter, Input, Output } from '@angular/core';
import { portal } from '../../enum/portal';
import { PopupComponent } from "../popup/popup.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entrance-portal',
  standalone: true,
  imports: [PopupComponent, CommonModule],
  templateUrl: './entrance-portal.component.html',
  styleUrl: './entrance-portal.component.css'
})
export class EntrancePortalComponent {

  @Input() userName: string = "";

  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() userNameChange = new EventEmitter<string>();

  portal = portal;
  needToGetUserName: boolean = false;

    // Sets popup and can be reused in other components that use popups
    setUserName(name: string) {
      this.userName = name;
      this.userNameChange.emit(name);
    }
  
    setUserNameFlag(needToGetUserName: boolean) {
      this.needToGetUserName = needToGetUserName;
    }
  
    popupActivatePortal(continueToPortal: boolean) {
      if (continueToPortal) {
        this.goToNextPortal.emit(portal.ChoosePortal);
      }
      this.setUserNameFlag(false);
    }
}
