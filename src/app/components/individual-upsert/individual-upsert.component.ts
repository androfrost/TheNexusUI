import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Individual } from '../../models/individual';
import { status } from '../../enum/status';
import { IndividualService } from '../../services/individual.service';
import { HttpClientModule } from '@angular/common/http';
import { portal } from '../../enum/portal';
import { DropdownDto } from '../../models/dto/dropdown-dto';
import { DataFormatting } from '../../helpers/data-formatting';
import { Navigation } from '../../helpers/navigation';

@Component({
  selector: 'app-individual-upsert',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './individual-upsert.component.html',
  styleUrls: ['./individual-upsert.component.css'],
  providers: [IndividualService]
})
export class IndividualUpsertComponent implements OnChanges, AfterViewInit, OnInit{

  status = status;

  @Input() upsertIndividual: Individual = new Individual();
  @Input() allPortalNavigation: number[] = [];
  @Input() dropdownDto: DropdownDto[] = [];
  @Input() locationDropdownDto: DropdownDto[] = [];
  @Input() phoneNumberDropdownDto: DropdownDto[] = [];
  @Input() individualTypeDropdownDto: DropdownDto[] = [];
  
  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() selectedItemChange = new EventEmitter<boolean>();

  groups: DropdownDto[] =  [];
  groupOption: number = 0;
  firstName: string = '';
  lastName: string = '';
  individualTypes: DropdownDto[] = []   //["Choose Type","Person", "Animal"];
  individualTypeOption: number = 0;
  sexes: string[] =  ["Choose Sex","Male", "Female"];
  sexOption: number = 0;
  dateOfBirthDate: Date = this.upsertIndividual.dateOfBirth;
  dateOfBirthString: string = this.dateOfBirthDate.toISOString();
  locations: DropdownDto[] =  this.locationDropdownDto;
  locationOption: number = 0;
  phoneNumbers: DropdownDto[] =  this.phoneNumberDropdownDto;
  phoneNumberOption: number = 0;
  description: string = this.upsertIndividual.individualDescription;
  statuses: string[] =  ["Active", "Inactive", "Deceased"];
  statusOption: number = this.upsertIndividual.statusId;

  isUpdate: boolean = false;

  DataFormatting: DataFormatting = new DataFormatting();
  navigation = Navigation;
  portal = portal;

  locationLength: number = 0;
  phoneNumberLength: number = 0;

  constructor(private individualService: IndividualService) {
  }

  ngOnInit(): void {

    // Determine if this is an update or add based on presence of IndividualId
    // If update, set all fields to match the input individual
    // If add, reset all fields to blank/zero
    if (this.upsertIndividual.individualId > 0){
      this.isUpdate = true;
    }else{
      this.isUpdate = false;
      this.upsertIndividual = new Individual();
    }
    // Set all fields to match the input individual if for update (will be blank for adding new)
    this.firstName = this.upsertIndividual.firstName;
    this.lastName = this.upsertIndividual.lastName;
    this.individualTypeOption = this.upsertIndividual.individualTypeId;
    this.description = this.upsertIndividual.individualDescription;
    this.statusOption = this.upsertIndividual.statusId;
    this.sexOption = this.upsertIndividual.sexId;
    this.dateOfBirthDate = this.upsertIndividual.dateOfBirth;
    this.setChosenOption(this.upsertIndividual.groupId, 'groupOption');
    this.locationOption = this.findArrayIndex(this.locations, this.upsertIndividual.locationId);
    this.phoneNumberOption = this.findArrayIndex(this.phoneNumbers, this.upsertIndividual.phoneNumberId);

    this.locationLength = this.locationDropdownDto.length;
    this.phoneNumberLength = this.phoneNumberDropdownDto.length;
  }

ngOnChanges(changes: SimpleChanges): void {
    if (changes['dropdownDto'] && this.groups.length <= 1) {
      this.groups = Array.isArray(this.dropdownDto) ? [...this.dropdownDto] : [];
      if (!this.groups.find(f => f.id === 0)) {
        this.groups.unshift({ id: 0, name: 'Choose Group' });
      }
    }

    if (changes['locationDropdownDto'] && this.locationLength !== this.locationDropdownDto.length) { // && this.locations.length <= 1) {
      this.locations = Array.isArray(this.locationDropdownDto) ? [...this.locationDropdownDto] : [];
      if (!this.locations.find(l => l.id === 0)) {
        this.locations.unshift({ id: 0, name: 'Choose Location' });
      }
      this.locationLength = this.locationDropdownDto.length;
      this.locationOption = this.findArrayIndex(this.locations, this.upsertIndividual.locationId);
    }

    if (changes['phoneNumberDropdownDto'] && this.phoneNumberLength !== this.phoneNumberDropdownDto.length) {   //&& this.phoneNumbers.length <= 1) {
      this.phoneNumbers = Array.isArray(this.phoneNumberDropdownDto) ? [...this.phoneNumberDropdownDto] : [];
      if (!this.phoneNumbers.find(p => p.id === 0)) {
        this.phoneNumbers.unshift({ id: 0, name: 'Choose Phone Number' });
      }
      this.phoneNumberLength = this.phoneNumberDropdownDto.length;
      this.phoneNumberOption = this.findArrayIndex(this.phoneNumbers, this.upsertIndividual.phoneNumberId);
    }

    if (changes['individualTypeDropdownDto'] && this.individualTypes.length <= 1) {
      this.individualTypes = Array.isArray(this.individualTypeDropdownDto) ? [...this.individualTypeDropdownDto] : [];
      if (!this.individualTypes.find(t => t.id === 0)) {
        this.individualTypes.unshift({ id: 0, name: 'Choose Type' });
      }
    }

    if (changes['upsertIndividual'] && this.upsertIndividual) {
      this.groupOption = this.upsertIndividual.groupId ?? 0;
      this.firstName = this.upsertIndividual.firstName ?? '';
      this.lastName = this.upsertIndividual.lastName ?? '';
      // if you have a date string property, set it here (e.g. dateOfBirthString)
      this.dateOfBirthString = DataFormatting.formatForInput(this.upsertIndividual.dateOfBirth);
      // Set individualTypeOption based on id
      const foundIndex = this.individualTypes.findIndex(t => t.id === this.upsertIndividual.individualTypeId);
      this.individualTypeOption = foundIndex >= 0 ? foundIndex : 0;
    }
  }

  TraversePortal(portalId: number) : void{
    this.goToNextPortal.emit(portalId);
    this.selectedItemChange.emit(true);
  }

  Save(){
    // Set Individual object values to save
    this.upsertIndividual.firstName = this.firstName;
    this.upsertIndividual.lastName = this.lastName;
    this.upsertIndividual.individualDescription = this.description;
    this.upsertIndividual.statusId = this.statusOption;
    this.upsertIndividual.individualTypeId = this.individualTypes[this.individualTypeOption]?.id || 0;
    this.upsertIndividual.sexId = this.sexOption;
    this.upsertIndividual.dateOfBirth = this.dateOfBirthDate; 
    this.upsertIndividual.groupId = this.groups[this.groupOption]?.id || 0;
    this.upsertIndividual.locationId = this.findArrayId(this.locations, this.locationOption);
    this.upsertIndividual.phoneNumberId = this.findArrayId(this.phoneNumbers, this.phoneNumberOption);
    // Call appropriate service function based on add vs update
    if (this.isUpdate)
      this.individualService.updateIndividual(this.upsertIndividual).subscribe((result: Individual) => (this.upsertIndividual = result));
    else
      this.individualService.ApiToasts
        .mapTest(this.individualService.addIndividual(this.upsertIndividual), "individualId", "Individual", this.upsertIndividual.firstName)
        .subscribe((result: Individual) => {
          this.upsertIndividual = result;
        });
    // Call cancel to reset and exit
    this.Cancel();
  }

  Reset(){
    // Reset all fields to blank/zero
    this.firstName = "";
    this.lastName = "";
    this.individualTypeOption = 0;
    this.setChosenFieldValue('drop-typ', this.individualTypeOption);
    this.sexOption = 0;
    this.setChosenFieldValue('drop-sex', this.sexOption);
    this.dateOfBirthDate = new Date();
    this.dateOfBirthString = "";
    this.groupOption = 0;
    this.setChosenOption(this.upsertIndividual.groupId, 'groupOption');
    this.locationOption = 0;
    this.setChosenFieldValueWithArray('drop-loc', this.locations, this.locationOption);
    this.phoneNumberOption = 0;
    this.setChosenFieldValueWithArray('drop-pho', this.phoneNumbers, this.phoneNumberOption);
    this.description = "";
    this.statusOption = 0;
    this.setChosenFieldValue('drop-sta', this.statusOption);
  }

  Cancel(){
    // Do Reset followed by returning to previous screen
    this.Reset();
    const returnPortal = this.navigation.returnToPreviousPortal(this.allPortalNavigation);
    this.goToNextPortal.emit(returnPortal);
  }

  ngAfterViewInit(): void {
    this.setChosenOption(this.upsertIndividual.groupId, 'groupOption');
  }

  getChosenFieldValue(element: string, fieldOption: keyof IndividualUpsertComponent) : void{
    const chosenElement = document.getElementById(element) as HTMLSelectElement;
    (this as any)[fieldOption] = chosenElement.selectedIndex;
  }

  setChosenFieldValue(element: string, typeId: number) : void{
    const chosenElement = document.getElementById(element) as HTMLSelectElement;
    chosenElement.selectedIndex = typeId;
  }

  setChosenFieldValueWithArray<T extends Array<any>>(element: string, valueT: T, typeId: number) : void{
    const chosenElement = document.getElementById(element) as HTMLSelectElement;
    chosenElement.selectedIndex = this.findArrayIndex(valueT, typeId);
 }

  setChosenOption(typeId: number, fieldOption: keyof IndividualUpsertComponent) : void{
    const foundIndex = this.groups.findIndex(f => f.id === typeId);
    (this as any)[fieldOption] = foundIndex >= 0 ? foundIndex : 0;
  }

  updateDateForSaving(){
    this.dateOfBirthDate = new Date(this.dateOfBirthString);
  }

  // General function to find id in any array of objects based on index, returns 0 if not found
  findArrayId<T extends Array<any>>(array: T, index: number) : number{
    return array[index]?.id || 0;
  }

  // General function to find index in any array of objects based on id, returns 0 if not found
  findArrayIndex<T extends Array<any>>(array: T, typeId: number) : number{
    const foundIndex = array.findIndex(l => l.id === typeId);
    return foundIndex >= 0 ? foundIndex : 0;
  }
}
