import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { portal } from '../../enum/portal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LookupDto } from '../../models/dto/lookup-dto';
import { DropdownDto } from '../../models/dto/dropdown-dto';
import { SortState } from '../../enum/sort-state';
import { Navigation } from '../../helpers/navigation';
import { Pagination } from '../../helpers/pagination';
@Component({
  selector: 'app-individual-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './individual-lookup.component.html',
  styleUrl: './individual-lookup.component.css'
})
export class IndividualLookupComponent implements OnChanges {

  portal = portal;
  portalState: number = 0;

  @Input() allPortalNavigation: number[] = []; // To keep track of navigation history and know where we will return to
  @Input() lookupDto: LookupDto[] = []; // The full list of lookup items passed from parent
  @Input() dropdownDto: DropdownDto[] = []; // The full list of dropdown items passed from parent
  @Input() lookupPortal: number = 0; //
  @Input() filteredSecondaryId: number = 0;  
  @Input() hasAssignedFlag: boolean = false; // To know whether to show the assigned/unassigned flags for items that have them (ex: Individuals in GroupUpsert)
  
  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() selectedItemChange = new EventEmitter<LookupDto>();
  @Output() sortChange = new EventEmitter<SortState>();
  @Output() lookupDtoChange = new EventEmitter<LookupDto[]>(); // To send back updated lookup list with assigned/unassigned changes
  @Output() assignedFlagChanges = new EventEmitter<{ id: number; isAssigned: boolean }[]>();
  
  private currentSortField?: 'id' | 'name' | 'isAssigned';
  private currentSortOrder: 'asc' | 'desc' = 'asc';
  private originalAssignedMap: Map<number, boolean> = new Map();
  private assignedChangesMap: Map<number, boolean> = new Map();

  lookupTerm: string = "";
  lookupSecondaryId: number = 0;
  lookupItems: LookupDto[] = [];

  secondIds: DropdownDto[] = this.dropdownDto;
  navigation = Navigation;
  pagination = new Pagination<LookupDto>();

  isDisabled: boolean = false;    // To disable anything that needs to not change when only wanting specific secondary Id

  page: LookupDto[] = [];
  pageSize: number = 10;
  currentPage: number = 1;

  ngOnInit(): void {
    if (this.filteredSecondaryId != 0 && this.allPortalNavigation[this.allPortalNavigation.length-2] == this.portal.GroupUpsert){
      this.isDisabled = true;
    }
    this.filterSearchLookupList();

    this.GetPage(this.currentPage);

    this.secondIds = [];
    for(const item of this.dropdownDto) 
      this.secondIds.push(item);

    this.secondIds.unshift({id: 0, name: "Choose Option"});

    // Capture original assigned state so we can compute net changes
    this.originalAssignedMap.clear();
    for (const it of this.lookupDto) {
      this.originalAssignedMap.set(it.id, !!it.isAssigned);
    }
    this.assignedChangesMap.clear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['lookupDto']) {
    //   this.currentSortField = undefined;
    //   this.currentSortOrder = 'asc';
    //   this.filterSearchLookupList();

    //   // rebuild original assigned map for new input
    //   this.originalAssignedMap.clear();
    //   for (const it of this.lookupDto) {
    //     this.originalAssignedMap.set(it.id, !!it.isAssigned);
    //   }
    //   this.assignedChangesMap.clear();
    // }
    // if (changes['dropdownDto']) {
    //   this.secondIds = [];
    //   for(const item of this.dropdownDto)
    //     this.secondIds.push(item);

    //   this.secondIds.unshift({id: 0, name: "Choose Option"});
    // }
  }

  TraversePortal(portalId: number) : void{
    this.goToNextPortal.emit(portalId);
  }

  Cancel(){
    var returnPortal = this.navigation.returnToPreviousPortal(this.allPortalNavigation);
    this.goToNextPortal.emit(returnPortal);
  } 

  ActivatePortal(portalId: number) : void{
    this.portalState = portalId;
  }

  // When updating what filters are allowed, update what is to be displayed
  filterSearchLookupList(): void {
    this.lookupSecondaryId = Number(this.lookupSecondaryId);
    if (this.filteredSecondaryId != 0 && this.allPortalNavigation[this.allPortalNavigation.length-2] == this.portal.GroupUpsert){
      this.lookupSecondaryId = this.filteredSecondaryId;
    }
    
    this.lookupItems = this.lookupDto;
    if (this.lookupSecondaryId !== 0){
      this.lookupItems = this.lookupItems.filter(item => item.secondId===this.lookupSecondaryId);
    }
    this.lookupItems = this.lookupItems.filter(item => item.name.toLowerCase().includes(this.lookupTerm.toLowerCase()));
    
    this.GetPage(1); // Reset to first page on new search or filter
  }

  // Simple sorting functions for the lookup list based on the field clicked in the UI, toggling between ascending and descending on each click
  Order(fieldName: 'id' | 'name' | 'isAssigned'): void {
    this.currentSortField = fieldName;
    this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    
    // Apply sort locally using the requested field
    this.lookupItems.sort((a, b) => {
      let compareResult = 0;

      switch (fieldName) {
        case 'id':
          compareResult = a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
          break;
        case 'name':
          compareResult = a.name.localeCompare(b.name);
          break;
        case 'isAssigned':
          // booleans: true > false
          compareResult = a.isAssigned === b.isAssigned ? 0 : a.isAssigned ? 1 : -1;
          break;
      }
      return this.currentSortOrder === 'asc' ? compareResult : -compareResult;
    });
    
    this.GetPage(1); // Reset to first page on new sort

    this.sortChange.emit({
      field: this.currentSortField,
      order: this.currentSortOrder
    });
  }
 
  SelectItem(item: LookupDto): void {
    this.selectedItemChange.emit(item);
    this.TraversePortal(this.lookupPortal);
  }

  ClickAssigned(item: LookupDto, $event: any): void {
    $event.stopPropagation(); // To prevent the click from also selecting the item and traversing the portal
    item.isAssigned = !item.isAssigned;
    this.lookupDtoChange.emit(this.lookupDto); // Emit the updated lookupDto to the parent

    const original = this.originalAssignedMap.get(item.id) || false;
    if (item.isAssigned === original) {
      // Net effect is no change relative to original
      this.assignedChangesMap.delete(item.id);
    } else {
      // Record net change (assign or unassign)
      this.assignedChangesMap.set(item.id, item.isAssigned);
    }
  }

  Save(): void {
    const changesArray = Array.from(this.assignedChangesMap.entries()).map(([id, isAssigned]) => ({ id, isAssigned }));
    this.assignedFlagChanges.emit(changesArray);

    this.Cancel();
  }

  GetPage(pageNumber: number): void{
    this.currentPage = pageNumber;
    this.page = this.pagination.GetPageRecords(this.lookupItems, pageNumber, this.pageSize);
  }
}