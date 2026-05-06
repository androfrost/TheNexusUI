import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LookupDto } from '../../models/dto/lookup-dto';
import { portal } from '../../enum/portal';
import { status } from '../../enum/status';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group-options',
  standalone: true,
  imports: [],
  templateUrl: './group-options.component.html',
  styleUrl: './group-options.component.css'
})
export class GroupOptionsComponent {
  portal = portal;
  portalState: number = 0;
  status = status;

  @Input() entrancePortal: number = 0;
  
  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() lookupDto = new EventEmitter<LookupDto[]>();
  @Output() selectedItemChange = new EventEmitter<boolean>();
 
  
  constructor(private groupService: GroupService) { }
  
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
