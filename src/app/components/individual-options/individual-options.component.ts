import { Component, EventEmitter, Input, Output } from '@angular/core';
import { portal } from '../../enum/portal';
import { status } from '../../enum/status';
import { Individual } from '../../models/individual';
import { IndividualService } from '../../services/individual.service';
import { LookupDto } from '../../models/dto/lookup-dto';

@Component({
  selector: 'app-individual-options',
  standalone: true,
  imports: [],
  templateUrl: './individual-options.component.html',
  styleUrl: './individual-options.component.css',
  providers: [IndividualService]
})
export class IndividualOptionsComponent {

  portal = portal;
  portalState: number = 0;
  status = status;

  @Input() entrancePortal: number = 0;
  
  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() lookupDto = new EventEmitter<LookupDto[]>();
  @Output() selectedItemChange = new EventEmitter<boolean>();

  lookupDtoOptions: LookupDto[] = []
  individualsOptions: Individual[] = [];

constructor(private individualService: IndividualService) { }

  TraversePortal(portalId: number) : void{
    this.goToNextPortal.emit(portalId);
    this.selectedItemChange.emit(true);
  }

  Cancel(){
    this.goToNextPortal.emit(this.entrancePortal);
    this.selectedItemChange.emit(true);
  } 

  activatePortal(portalId: number) : void{
    this.portalState = portalId;
  }

  // This function is intended to populate a lookup list for selecting an Individual, but was causing errors
  // IndividualsLookup(portalId: number) : void{
  //     if (portalId == portal.IndividualLookup){
  //       //this.individualService.getIndividualsByStatusId(status.Active).subscribe((result: Individual[]) => (this.individualsOptions = result));
  //       this.individualService.getIndividuals().subscribe((result: Individual[]) => (this.individualsOptions = result));
  //       this.lookupDtoOptions = []; // Clear existing entries
  //       for (const individual of this.individualsOptions) {
  //         this.lookupDtoOptions.push({ id: individual.individualId, secondId: individual.familyId, name: individual.firstName + ' ' + individual.lastName });
  //       }
  //     }
  //   }
}
