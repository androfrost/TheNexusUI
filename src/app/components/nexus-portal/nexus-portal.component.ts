import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IndividualUpsertComponent } from "../individual-upsert/individual-upsert.component";
import { portal } from '../../enum/portal';
import { status } from '../../enum/status';
import { MainMenuComponent } from "../main-menu/main-menu.component";
import { FamilyUpsertComponent } from "../family-upsert/family-upsert.component";
import { IndividualOptionsComponent } from "../individual-options/individual-options.component";
import { IndividualLookupComponent } from "../individual-lookup/individual-lookup.component";
import { LookupDto } from '../../models/dto/lookup-dto'; // Update the path as needed
import { IndividualService } from '../../services/individual.service';

import { Individual } from '../../models/individual';

@Component({
  selector: 'app-nexus-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, IndividualOptionsComponent, IndividualUpsertComponent,
    MainMenuComponent, FamilyUpsertComponent, IndividualLookupComponent],
  templateUrl: './nexus-portal.component.html',
  styleUrl: './nexus-portal.component.css',
  providers: [IndividualService]
})
export class NexusPortalComponent {
  portal = portal;
  portalState: number = 0;
  newPortalState: number = portal.IndividualUpsert;
  private intervalId: any;

  status = status;
  
  lookupDtoMain: LookupDto[] = [];
  individualsMain: Individual[] = [];

  constructor(private cdr: ChangeDetectorRef, private individualService: IndividualService) {
    // Mock data for demonstration purposes
    // this.lookupDtoMain = [
    //   {id: 1, secondId: 1, name: "Bob"       },
    //   {id: 2, secondId: 1, name: "Sam"       },
    //   {id: 3, secondId: 2, name: "Jim"       },
    //   {id: 4, secondId: 3, name: "BobSamJim" },
    //   {id: 5, secondId: 2, name: "Sue"       },
    //   {id: 6, secondId: 1, name: "Sally"     },
    //   {id: 7, secondId: 4, name: "Billy"     },
    //   {id: 8, secondId: 4, name: "Suzy"      }
    // ];

    this.individualService.getIndividuals().subscribe((result: Individual[]) => (this.individualsMain = result));
    
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
    this.IndividualsLookup(portalId);
    this.portalState = portalId;
    //this.cdr.detectChanges();
  }

  IndividualsLookup(portalId: number) : void{
    if (portalId == portal.IndividualLookup){
      //this.individualService.getIndividualsByStatusId(status.Active).subscribe((result: Individual[]) => (this.individualsMain = result));
      this.individualService.getIndividuals().subscribe((result: Individual[]) => (this.individualsMain = result));
      this.lookupDtoMain = []; // Clear existing entries
      for (const individual of this.individualsMain) {
        this.lookupDtoMain.push({ id: individual.individualId, secondId: individual.familyId, name: individual.firstName + ' ' + individual.lastName });
      }
    }
  }
}
