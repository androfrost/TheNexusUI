import { Component, EventEmitter, Input, Output } from '@angular/core';
import { portal } from '../../enum/portal';
import { PopupComponent } from "../popup/popup.component";
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-entrance-portal',
  standalone: true,
  imports: [PopupComponent, CommonModule],
  templateUrl: './entrance-portal.component.html',
  styleUrls: ['./entrance-portal.component.css']
})
export class EntrancePortalComponent {

  @Input() userName: string = "";

  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() userNameChange = new EventEmitter<string>();

  portal = portal;
  needToGetUserName: boolean = false;

  constructor(private toastService: ToastService) {}

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

    const message = this.userName && this.userName.trim() 
      ? 'Welcome to The Nexus, ' + this.userName + '!' 
      : 'Welcome to The Nexus!';
    this.toastService.zoneRun(message, 'success');
  }
}
