import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LookupDto } from '../../models/dto/lookup-dto';
import { portal } from '../../enum/portal';
import { status } from '../../enum/status';
import { FamilyService } from '../../services/family.service';

@Component({
  selector: 'app-family-options',
  standalone: true,
  imports: [],
  templateUrl: './family-options.component.html',
  styleUrl: './family-options.component.css'
})
export class FamilyOptionsComponent {
  portal = portal;
  portalState: number = 0;
  status = status;

  @Input() entrancePortal: number = 0;
  
  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() lookupDto = new EventEmitter<LookupDto[]>();
  @Output() selectedItemChange = new EventEmitter<boolean>();
 
  
  constructor(private familyService: FamilyService) { }
  
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
}
