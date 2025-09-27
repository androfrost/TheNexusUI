import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Individual } from '../../models/individual';
import { status } from '../../enum/status';
import { IndividualService } from '../../services/individual.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  @Input() entrancePortal: number = 0;
  
  @Output() goToNextPortal = new EventEmitter<number>();


  families: string[] =  ["Choose Family","Mouse", "Duck","Fredrickson"];
  familyOption: number = this.upsertIndividual.familyId;
  firstName: string = this.upsertIndividual.firstName;
  lastName: string = this.upsertIndividual.lastName;
  individualTypes: string[] =  ["Choose Type","Person", "Animal"];
  individualTypeOption: number = 0;
  sexes: string[] =  ["Choose Sex","Male", "Female"];
  sexOption: number = 1;
  dateOfBirth: Date = this.upsertIndividual.dateOfBirth;
  locations: string[] =  ["Choose Address","123 Fake Street", "321 Real Street","2828 Squarehill Dr"];
  locationOption: number = 0;
  phoneNumbers: string[] =  ["Choose Phone Number","123-456-7890"];
  phoneNumberOption: number = 0;
  description: string = this.upsertIndividual.individualDescription;
  statuses: string[] =  ["Active", "Inactive", "Deceased"];
  statusOption: number = this.upsertIndividual.statusId;

  constructor(private individualService: IndividualService) {  }

  Save(){
    // Set Individual object values to save
    this.upsertIndividual.firstName = this.firstName;
    this.upsertIndividual.lastName = this.lastName;
    this.upsertIndividual.individualDescription = this.description;
    this.upsertIndividual.statusId = this.statusOption;
    this.upsertIndividual.individualTypeId = this.individualTypeOption;
    this.upsertIndividual.sexId = this.sexOption;
    this.upsertIndividual.dateOfBirth = this.dateOfBirth;
    this.upsertIndividual.familyId = this.familyOption;
    this.upsertIndividual.locationId = this.locationOption;
    this.upsertIndividual.phoneNumberId = this.phoneNumberOption;

    this.individualService.addIndividual(this.upsertIndividual).subscribe((result: Individual) => (this.upsertIndividual = result));

    // Call cancel to reset and exit
    this.Cancel();
  }

  Reset(){
    this.firstName = "";
    this.lastName = "";
    this.individualTypeOption = 0;
    this.SetChosenType(this.individualTypeOption);
    this.sexOption = 0;
    this.SetChosenSex(this.sexOption);
    this.dateOfBirth = new Date();
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
    this.goToNextPortal.emit(this.entrancePortal);
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
}
