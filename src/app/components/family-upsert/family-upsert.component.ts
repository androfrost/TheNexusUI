import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Family } from '../../models/family';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-family-upsert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './family-upsert.component.html',
  styleUrl: './family-upsert.component.css'
})
export class FamilyUpsertComponent {

  @Input() upsertFamily : Family = new Family();
  @Input() entrancePortal: number = 0;

  @Output() goToNextPortal = new EventEmitter<number>();

  familyName: string = this.upsertFamily.familyName;
  familyDescription: string = this.upsertFamily.description;

  Save(){
    this.upsertFamily.familyName = this.familyName;
    this.upsertFamily.description = this.familyDescription;

    console.log(this.upsertFamily.familyName);
    console.log(this.upsertFamily.description);
  }
  
  Reset(){
    this.familyName = "";
    this.familyDescription = "";
  
  }

  Cancel(){
    this.Reset();
    this.goToNextPortal.emit(this.entrancePortal);
  }
}
