import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Group } from '../../models/group';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { HttpClientModule } from '@angular/common/http';
import { portal } from '../../enum/portal';
import { Navigation } from '../../helpers/navigation';

@Component({
  selector: 'app-group-upsert',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './group-upsert.component.html',
  styleUrl: './group-upsert.component.css',
  providers: [GroupService]
})
export class GroupUpsertComponent {

  portal = portal;

  @Input() upsertGroup : Group = new Group();
  @Input() allPortalNavigation: number[] = [];

  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() selectedItemChange = new EventEmitter<boolean>();

  groupName: string = this.upsertGroup.groupName;
  groupDescription: string = this.upsertGroup.groupDescription;
  groups: string[] =  ["Choose Group","Family", "Work", "Friends", "Other"];
  groupOption: number = 0;
  
  isUpdate: boolean = false;
  navigation = Navigation

  constructor(@Inject(GroupService) private groupService: GroupService) {  }

  ngOnInit(): void{
    // Determine if this is an update or add based on presence of IndividualId
    // If update, set all fields to match the input individual
    // If add, reset all fields to blank/zero
    if (this.upsertGroup.groupId > 0){
      this.isUpdate = true;
    }else{
      this.isUpdate = false;
      this.upsertGroup = new Group();
    }
    this.groupName = this.upsertGroup.groupName;
    this.groupDescription = this.upsertGroup.groupDescription;
    this.groupOption = this.upsertGroup.groupTypeId;
  }

  TraversePortal(portalId: number) : void{
    this.goToNextPortal.emit(portalId);
    this.selectedItemChange.emit(true);
  }

  Save(){
    this.upsertGroup.groupName = this.groupName;
    this.upsertGroup.groupDescription = this.groupDescription;
    this.upsertGroup.groupTypeId = this.groupOption;

    // Call appropriate service function based on add vs update
    if (this.isUpdate)
      this.groupService.updateGroup(this.upsertGroup).subscribe((result: Group) => (this.upsertGroup = result));
    else
      this.groupService.addGroup(this.upsertGroup).subscribe((result: Group) => (this.upsertGroup = result));

    // Call cancel to reset and exit
    this.Cancel();
  }
  
  Reset(){
    this.groupName = "";
    this.groupDescription = "";
    this.SetChosenGroup(this.groupOption);
  }

  Cancel(){
    this.Reset();
    var returnPortal = this.navigation.returnToPreviousPortal(this.allPortalNavigation);
    this.goToNextPortal.emit(returnPortal);
  }

  GetChosenGroup() : void{
    let chosenGroup = document.getElementById("drop-gro") as HTMLSelectElement;
    this.groupOption = chosenGroup.selectedIndex;
  }

  SetChosenGroup(typeId: number) : void{
    let chosenGroup = document.getElementById("drop-gro") as HTMLSelectElement;
    chosenGroup.selectedIndex = typeId;
  }
}
