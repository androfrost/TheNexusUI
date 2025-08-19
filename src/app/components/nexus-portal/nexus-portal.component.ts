import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
//import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-nexus-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nexus-portal.component.html',
  styleUrl: './nexus-portal.component.css'
})
export class NexusPortalComponent {

  families: string[] =  ["Choose Family","Mouse", "Duck","Fredrickson"];
  familyOption: number = 0;
  firstName: string = "";
  lastName: string = "";
  locations: string[] =  ["Choose Address","123 Fake Street", "321 Real Street","2828 Squarehill Dr"];
  locationOption: number = 0;
  phoneNumbers: string[] =  ["Choose Phone Number","123-456-7890"];
  phoneNumberOption: number = 0;
  description: string = "";

  Save(){
    console.log(this.firstName+ " " +this.lastName);
    console.log(this.locationOption);
  }
  
  GetChosenLocation() : void{
    let chosenLocation = document.getElementById("drop-loc") as HTMLSelectElement;
    console.log(chosenLocation.selectedIndex);
    this.locationOption = chosenLocation.selectedIndex;
  }

  GetChosenFamily() : void{
    let chosenFamily = document.getElementById("drop-fam") as HTMLSelectElement;
    console.log(chosenFamily.selectedIndex);
    this.familyOption = chosenFamily.selectedIndex;
  }

  GetChosenPhoneNumber() : void{
    let chosenPhoneNumber = document.getElementById("drop-fam") as HTMLSelectElement;
    console.log(chosenPhoneNumber.selectedIndex);
    this.phoneNumberOption = chosenPhoneNumber.selectedIndex;
  }
}
