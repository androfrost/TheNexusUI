import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { portal } from '../../enum/portal';
import { status } from '../../enum/status';
import { LookupDto } from '../../models/dto/lookup-dto';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css',
  providers: []
})
export class OptionsComponent {

  portal = portal;
  portalState: number = 0;
  status = status;

  @Input() entrancePortal: number = 0;
  @Input() optionName: string = "";
  @Input() optionButtonNames: string[] = [];
  @Input() optionButtonPortals: number[] = [];
  
  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() lookupDto = new EventEmitter<LookupDto[]>();
  @Output() selectedItemChange = new EventEmitter<boolean>();

  lookupDtoOptions: LookupDto[] = []

constructor() { }

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
