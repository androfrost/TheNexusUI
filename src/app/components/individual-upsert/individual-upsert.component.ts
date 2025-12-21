import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Individual } from '../../models/individual';
import { status } from '../../enum/status';
import { IndividualService } from '../../services/individual.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { portal } from '../../enum/portal';
import { DropdownDto } from '../../models/dto/dropdown-dto';
import { DataFormatting } from '../../helpers/data-formatting';
import { Navigation } from '../../helpers/navigation';

@Component({
  selector: 'app-individual-upsert',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './individual-upsert.component.html',
  styleUrl: './individual-upsert.component.css',
  providers: [IndividualService]
})
export class IndividualUpsertComponent {

  status = status;

  @Input() upsertIndividual: Individual = new Individual();
  @Input() allPortalNavigation: number[] = [];
  @Input() dropdownDto: DropdownDto[] = [];
  
  @Output() goToNextPortal = new EventEmitter<number>();

  families: DropdownDto[] =  this.dropdownDto
  familyOption: number = this.upsertIndividual.familyId;
  firstName: string = this.upsertIndividual.firstName;
  lastName: string = this.upsertIndividual.lastName;
  individualTypes: string[] =  ["Choose Type","Person", "Animal"];
  individualTypeOption: number = 0;
  sexes: string[] =  ["Choose Sex","Male", "Female"];
  sexOption: number = 0;
  dateOfBirthDate: Date = this.upsertIndividual.dateOfBirth;
  dateOfBirthString: string = this.dateOfBirthDate.toISOString();
  locations: string[] =  ["Choose Address","123 Fake Street", "321 Real Street","2828 Squarehill Dr"];
  locationOption: number = 0;
  phoneNumbers: string[] =  ["Choose Phone Number","123-456-7890"];
  phoneNumberOption: number = 0;
  description: string = this.upsertIndividual.individualDescription;
  statuses: string[] =  ["Active", "Inactive", "Deceased"];
  statusOption: number = this.upsertIndividual.statusId;

  isUpdate: boolean = false;

  DataFormatting: DataFormatting = new DataFormatting();
  navigation = Navigation;

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
    this.description = this.upsertIndividual.individualDescription;
    this.statusOption = this.upsertIndividual.statusId;
    this.individualTypeOption = this.upsertIndividual.individualTypeId;
    this.sexOption = this.upsertIndividual.sexId;
    this.dateOfBirthDate = this.upsertIndividual.dateOfBirth;
    this.familyOption = this.upsertIndividual.familyId;
    this.locationOption = this.upsertIndividual.locationId;
    this.phoneNumberOption = this.upsertIndividual.phoneNumberId;
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['dropdownDto']) {
        // Parent updated the dropdownDto input (e.g. async fetch completed)
        this.families = [];
        for(const item of this.dropdownDto) 
          this.families.push(item);
        
        this.families.unshift({id: 0, name: "Choose Family"});
      }
      if (changes['upsertIndividual'] && this.upsertIndividual?.dateOfBirth) {
        this.dateOfBirthString = DataFormatting.formatForInput(this.upsertIndividual.dateOfBirth);
      }
    }

  Save(){
    // Set Individual object values to save
    this.upsertIndividual.firstName = this.firstName;
    this.upsertIndividual.lastName = this.lastName;
    this.upsertIndividual.individualDescription = this.description;
    this.upsertIndividual.statusId = this.statusOption;
    this.upsertIndividual.individualTypeId = this.individualTypeOption;
    this.upsertIndividual.sexId = this.sexOption;
    this.upsertIndividual.dateOfBirth = this.dateOfBirthDate; 
    this.upsertIndividual.familyId = this.families[this.familyOption].id;
    this.upsertIndividual.locationId = this.locationOption;
    this.upsertIndividual.phoneNumberId = this.phoneNumberOption;
    // Call appropriate service function based on add vs update
    if (this.isUpdate)
      this.individualService.updateIndividual(this.upsertIndividual).subscribe((result: Individual) => (this.upsertIndividual = result));
    else
      this.individualService.addIndividual(this.upsertIndividual).subscribe((result: Individual) => (this.upsertIndividual = result));

    // Call cancel to reset and exit
    this.Cancel();
  }

  Reset(){
    // Reset all fields to blank/zero
    this.firstName = "";
    this.lastName = "";
    this.individualTypeOption = 0;
    this.SetChosenType(this.individualTypeOption);
    this.sexOption = 0;
    this.SetChosenSex(this.sexOption);
    this.dateOfBirthDate = new Date();
    this.dateOfBirthString = "";
    this.familyOption = 0;
    this.SetChosenFamily(this.familyOption);
    this.locationOption = 0;
    this.SetChosenLocation(this.locationOption);
    this.phoneNumberOption = 0;
    this.SetChosenPhoneNumber(this.phoneNumberOption);
    this.description = "";
    this.statusOption = 0;
    this.SetChosenStatus(this.statusOption);
  }

  Cancel(){
    // Do Reset followed by returning to previous screen
    this.Reset();
    var returnPortal = this.navigation.returnToPreviousPortal(this.allPortalNavigation);
    this.goToNextPortal.emit(returnPortal);
  }

  GetChosenType() : void{
    let chosenType = document.getElementById("drop-typ") as HTMLSelectElement;
    this.sexOption = chosenType.selectedIndex;
  }

  SetChosenType(typeId: number) : void{
    let chosenType = document.getElementById("drop-typ") as HTMLSelectElement;
    chosenType.selectedIndex = typeId;
  }
  
  GetChosenSex() : void{
    let chosenSex = document.getElementById("drop-sex") as HTMLSelectElement;
    this.sexOption = chosenSex.selectedIndex;
  }

  SetChosenSex(typeId: number) : void{
    let chosenSex = document.getElementById("drop-sex") as HTMLSelectElement;
    chosenSex.selectedIndex = typeId;
  }

  GetChosenLocation() : void{
    let chosenLocation = document.getElementById("drop-loc") as HTMLSelectElement;
    this.locationOption = chosenLocation.selectedIndex;
  }

  SetChosenLocation(typeId: number) : void{
    let chosenLocation = document.getElementById("drop-loc") as HTMLSelectElement;
    chosenLocation.selectedIndex = typeId;
  }

  GetChosenFamily() : void{
    let chosenFamily = document.getElementById("drop-fam") as HTMLSelectElement;
    this.familyOption = chosenFamily.selectedIndex;
  }

  SetChosenFamily(typeId: number) : void{
    let chosenFamily = document.getElementById("drop-fam") as HTMLSelectElement;
    chosenFamily.selectedIndex = typeId;
  }

  GetChosenPhoneNumber() : void{
    let chosenPhoneNumber = document.getElementById("drop-pho") as HTMLSelectElement;
    this.phoneNumberOption = chosenPhoneNumber.selectedIndex;
  }

  SetChosenPhoneNumber(typeId: number) : void{
    let chosenPhoneNumber = document.getElementById("drop-pho") as HTMLSelectElement;
    chosenPhoneNumber.selectedIndex = typeId;
  }

  GetChosenStatus() : void{
    let chosenStatus = document.getElementById("drop-sta") as HTMLSelectElement;
    this.statusOption = chosenStatus.selectedIndex;
  }

  SetChosenStatus(typeId: number) : void{
    let chosenStatus = document.getElementById("drop-sta") as HTMLSelectElement;
    chosenStatus.selectedIndex = typeId;
  }

  updateDateForSaving(){
    this.dateOfBirthDate = new Date(this.dateOfBirthString);
  }
}
