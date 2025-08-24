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
  
  @Output() returnToPreviousPortal = new EventEmitter<number>();

  families: string[] =  ["Choose Family","Mouse", "Duck","Fredrickson"];
  familyOption: number = 0;
  firstName: string = this.upsertIndividual.firstName;
  lastName: string = this.upsertIndividual.lastName;
  locations: string[] =  ["Choose Address","123 Fake Street", "321 Real Street","2828 Squarehill Dr"];
  locationOption: number = 0;
  phoneNumbers: string[] =  ["Choose Phone Number","123-456-7890"];
  phoneNumberOption: number = 0;
  description: string = this.upsertIndividual.description;

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
    this.familyOption = 0;
    this.SetChosenFamily();
    this.locationOption = 0;
    this.SetChosenLocation();
    this.phoneNumberOption = 0;
    this.SetChosenPhoneNumber();
    this.description = "";  
  }

  Cancel(){
    this.Reset();
    this.returnToPreviousPortal.emit(this.entrancePortal);
  }
  
  GetChosenLocation() : void{
    let chosenLocation = document.getElementById("drop-loc") as HTMLSelectElement;
    this.locationOption = chosenLocation.selectedIndex;
  }

  SetChosenLocation() : void{
    let chosenLocation = document.getElementById("drop-loc") as HTMLSelectElement;
    chosenLocation.selectedIndex = 0;
  }

  GetChosenFamily() : void{
    let chosenFamily = document.getElementById("drop-fam") as HTMLSelectElement;
    this.familyOption = chosenFamily.selectedIndex;
  }

  SetChosenFamily() : void{
    let chosenFamily = document.getElementById("drop-fam") as HTMLSelectElement;
    chosenFamily.selectedIndex = 0;
  }

  GetChosenPhoneNumber() : void{
    let chosenPhoneNumber = document.getElementById("drop-pho") as HTMLSelectElement;
    this.phoneNumberOption = chosenPhoneNumber.selectedIndex;
  }

  SetChosenPhoneNumber() : void{
    let chosenPhoneNumber = document.getElementById("drop-pho") as HTMLSelectElement;
    chosenPhoneNumber.selectedIndex = 0;
  }
}
