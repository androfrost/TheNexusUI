import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IndividualUpsertComponent } from "../individual-upsert/individual-upsert.component";
import { portal } from '../../enum/portal';
import { MainMenuComponent } from "../main-menu/main-menu.component";

@Component({
  selector: 'app-nexus-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, IndividualUpsertComponent, MainMenuComponent],
  templateUrl: './nexus-portal.component.html',
  styleUrl: './nexus-portal.component.css'
})
export class NexusPortalComponent {
  portal = portal;
  portalState: number = 0;
  newPortalState: number = portal.IndividualUpsert;
  private intervalId: any;

  constructor(private cdr: ChangeDetectorRef) {
    console.log(this.portalState);
  }

  ngOnInit(): void {
    this.activePortalInterval(true);
  }

  activePortalInterval(isActive: boolean) : void{
    // if (this.portalState == portal.NexusPortal) {
    //   this.intervalId = setInterval(() => {
    //     console.log(this.portalState);
    //     this.portalState = portal.IndividualUpsert;
    //     console.log(this.portalState);
    //     if (this.portalState != portal.NexusPortal){
    //       clearInterval(this.intervalId); // Clear interval after setting state);
    //     }
    //   }, 1000); // Check every 100ms
    // }
  }

  activatePortal(portalId: number) : void{
    this.portalState = portalId;
    //this.cdr.detectChanges();
  }
}
