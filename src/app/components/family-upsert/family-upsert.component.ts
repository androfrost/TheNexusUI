import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Family } from '../../models/family';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FamilyService } from '../../services/family.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-family-upsert',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './family-upsert.component.html',
  styleUrl: './family-upsert.component.css',
  providers: [FamilyService]
})
export class FamilyUpsertComponent {

  @Input() upsertFamily : Family = new Family();
  @Input() entrancePortal: number = 0;

  @Output() goToNextPortal = new EventEmitter<number>();

  familyName: string = this.upsertFamily.familyName;
  familyDescription: string = this.upsertFamily.familyDescription;
  
  isUpdate: boolean = false;

  constructor(private familyService: FamilyService) {  }

  ngOnInit(): void{
    // Determine if this is an update or add based on presence of IndividualId
    // If update, set all fields to match the input individual
    // If add, reset all fields to blank/zero
    if (this.upsertFamily.familyId > 0){
      this.isUpdate = true;
    }else{
      this.isUpdate = false;
      this.upsertFamily = new Family();
    }
    this.familyName = this.upsertFamily.familyName;
    this.familyDescription = this.upsertFamily.familyDescription;
  }

  Save(){
    this.upsertFamily.familyName = this.familyName;
    this.upsertFamily.familyDescription = this.familyDescription;

    // Call appropriate service function based on add vs update
    if (this.isUpdate)
      this.familyService.updateFamily(this.upsertFamily).subscribe((result: Family) => (this.upsertFamily = result));
    else
      this.familyService.addFamily(this.upsertFamily).subscribe((result: Family) => (this.upsertFamily = result));

    // Call cancel to reset and exit
    this.Cancel();
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
