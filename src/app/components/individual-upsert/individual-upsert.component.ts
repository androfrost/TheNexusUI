import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Individual } from '../../models/individual';

@Component({
  selector: 'app-individual-upsert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './individual-upsert.component.html',
  styleUrl: './individual-upsert.component.css'
})
export class IndividualUpsertComponent {

  @Input() upsertIndividual: Individual = new Individual();
  @Input() entrancePortal: number = 0;
  
  @Output() goToNextPortal = new EventEmitter<number>();

  families: string[] =  ["Choose Family","Mouse", "Duck","Fredrickson"];
  familyOption: number = 0;
  firstName: string = this.upsertIndividual.firstName;
  lastName: string = this.upsertIndividual.lastName;
  types: string[] =  ["Choose Type","Person", "Animal"];
  typeOption: number = 0;
  sexes: string[] =  ["Choose Sex","Male", "Female"];
  sexOption: number = 0;
  dateOfBirth: Date = this.upsertIndividual.dateOfBirth;
  locations: string[] =  ["Choose Address","123 Fake Street", "321 Real Street","2828 Squarehill Dr"];
  locationOption: number = 0;
  phoneNumbers: string[] =  ["Choose Phone Number","123-456-7890"];
  phoneNumberOption: number = 0;
  description: string = this.upsertIndividual.description;
  statuses: string[] =  ["Choose Status","Active", "Inactive", "Deceased"];
  statusOption: number = 1;

  Save(){
    this.upsertIndividual.firstName = this.firstName;
    this.upsertIndividual.lastName = this.lastName;
    this.upsertIndividual.description = this.description;

    console.log(this.upsertIndividual.firstName+ " " +this.upsertIndividual.lastName);
    console.log(this.upsertIndividual.description);
  }

  Reset(){
    this.firstName = "";
    this.lastName = "";
    this.typeOption = 0;
    this.SetChosenType(this.typeOption);
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
    this.statusOption = 1;
    this.SetChosenStatus(this.statusOption);
  }

  Cancel(){
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
