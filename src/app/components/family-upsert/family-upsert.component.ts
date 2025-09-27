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

  constructor(private familyService: FamilyService) {  }

  Save(){
    this.upsertFamily.familyName = this.familyName;
    this.upsertFamily.familyDescription = this.familyDescription;

    this.familyService.addFamily(this.upsertFamily).subscribe((result: Family) => (this.upsertFamily = result));

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
