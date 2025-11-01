import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { portal } from '../../enum/portal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LookupDto } from '../../models/dto/lookup-dto';
import { DropdownDto } from '../../models/dto/dropdown-dto';
import { Console } from 'console';
import { SortState } from '../../enum/sort-state';

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

  @Input() entrancePortal: number = 0;
  @Input() lookupDto: LookupDto[] = [];
  @Input() dropdownDto: DropdownDto[] = [];
  @Input() lookupPortal: number = 0;
  
  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() selectedItemChange = new EventEmitter<LookupDto>();
  @Output() sortChange = new EventEmitter<SortState>();
  private currentSortField?: 'id' | 'name';
  private currentSortOrder: 'asc' | 'desc' = 'asc';


  lookupTerm: string = "";
  lookupSecondaryId: number = 0;
  lookupItems: LookupDto[] = [];

  secondIds: DropdownDto[] = this.dropdownDto;

  ngOnInit(): void {
    this.searchLookupList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lookupDto']) {
      // Reset sort state when new data arrives
      this.currentSortField = undefined;
      this.currentSortOrder = 'asc';
      // Parent updated the lookupDto input (e.g. async fetch completed)
      this.searchLookupList();
    }
    if (changes['dropdownDto']) {
      // Parent updated the dropdownDto input (e.g. async fetch completed)
      this.secondIds = [];
      for(const item of this.dropdownDto) 
        this.secondIds.push(item);

      this.secondIds.unshift({id: 0, name: "Choose Option"});
    }
  }

  TraversePortal(portalId: number) : void{
    this.goToNextPortal.emit(portalId);
  }

  Cancel(){
    this.goToNextPortal.emit(this.entrancePortal);
  } 

  ActivatePortal(portalId: number) : void{
    this.portalState = portalId;
  }

  // When updating what filters are allowed, update what is to be displayed
  searchLookupList(): void {
    this.lookupItems = this.lookupDto;
    if (this.lookupSecondaryId != 0){
      this.lookupItems = this.lookupItems.filter(item => item.secondId.toString().includes(this.lookupSecondaryId.toString()));
    }
    this.lookupItems = this.lookupItems.filter(item => item.name.toLowerCase().includes(this.lookupTerm.toLowerCase()));
  }

  // Simple sorting functions for the lookup list
  OrderId(): void {
    this.currentSortField = 'id';
    this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    
    // Apply sort locally
    this.lookupItems.sort((a, b) => {
      const compareResult = a.id > b.id ? 1 : -1;
      return this.currentSortOrder === 'asc' ? compareResult : -compareResult;
    });
    
    this.sortChange.emit({
      field: this.currentSortField,
      order: this.currentSortOrder
    });
  }
  OrderName(): void {
    this.currentSortField = 'name';
    this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    
    // Apply sort locally
    this.lookupItems.sort((a, b) => {
      const compareResult = a.name.localeCompare(b.name);
      return this.currentSortOrder === 'asc' ? compareResult : -compareResult;
    });
    
    this.sortChange.emit({
      field: this.currentSortField,
      order: this.currentSortOrder
    });
  }
 
  SelectItem(item: LookupDto): void {
    this.selectedItemChange.emit(item);
    this.TraversePortal(this.lookupPortal);
  }
}
