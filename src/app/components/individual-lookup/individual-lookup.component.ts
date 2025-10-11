import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { portal } from '../../enum/portal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LookupDto } from '../../models/dto/lookup-dto';

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
  
  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() selectedItemChange = new EventEmitter<LookupDto>();

  lookupTerm: string = "";
  lookupSecondaryId: number = 0;
  lookupItems: LookupDto[] = [];

  secondIds: any[] = [
    {id: 0, title: "Choose Family"},
    {id: 1, title: "Family 1"},
    {id: 2, title: "Family 2"},
    {id: 3, title: "Family 3"},
    {id: 4, title: "Family 4"}
  ];

  ngOnInit(): void {
    this.searchLookupList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lookupDto']) {
      // Parent updated the lookupDto input (e.g. async fetch completed)
      this.searchLookupList();
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
    this.lookupItems = this.lookupItems.sort((a, b) => a.id - b.id);
  }
  OrderName(): void {
    this.lookupItems = this.lookupItems.sort((a, b) => a.name.localeCompare(b.name));
  }
 
  SelectItem(item: LookupDto): void {
    this.selectedItemChange.emit(item);
    this.TraversePortal(portal.IndividualUpsert);
  }
}
