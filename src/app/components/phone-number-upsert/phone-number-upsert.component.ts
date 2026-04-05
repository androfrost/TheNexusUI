import { Component, EventEmitter, Input, Output } from '@angular/core';
import { portal } from '../../enum/portal';
import { PhoneNumber } from '../../models/phone-number';
import { PhoneNumberService } from '../../services/phone-number.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Navigation } from '../../helpers/navigation';
import { IndividualPhoneNumbersDto } from '../../models/dto/individual-phone-number-dto';
import { DataFormatting } from '../../helpers/data-formatting';

@Component({
  selector: 'app-phone-number-upsert',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './phone-number-upsert.component.html',
  styleUrl: './phone-number-upsert.component.css',
  providers: [PhoneNumberService]
})
export class PhoneNumberUpsertComponent {
  portal = portal;
  
  @Input() upsertPhoneNumber : PhoneNumber = new PhoneNumber();
  @Input() individualId: number = 0;
  @Input() allPortalNavigation: number[] = [];

  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() selectedItemChange = new EventEmitter<boolean>();
  
  private isUpdate: boolean = false;
  private navigation = Navigation

  private _phoneNumberValue: string = "";
  public phoneNumberType: number = 0;
  phoneNumberTypes = [
    { value: 0, display: 'Mobile' },
    { value: 1, display: 'Home' },
    { value: 2, display: 'Work' },
    { value: 3, display: 'Other' }
  ];
  public phoneNumberTypeOption: number = 0;

  get phoneNumberValue(): string {
    return this._phoneNumberValue;
  }

  set phoneNumberValue(value: string) {
    this._phoneNumberValue = DataFormatting.formatPhoneNumber(value);
  }

  constructor(private phoneNumberService: PhoneNumberService) {  }

  ngOnInit(): void{
    // Determine if this is an update or add based on presence of PhoneNumberId
    // If update, set all fields to match the input phoneNumber
    // If add, reset all fields to blank/zero
    if (this.upsertPhoneNumber.phoneNumberId > 0){
      this.isUpdate = true;
    }else{
      this.isUpdate = false;
      this.upsertPhoneNumber = new PhoneNumber();
    }
    this._phoneNumberValue = this.upsertPhoneNumber.phoneNumberValue;
    this.phoneNumberType = this.upsertPhoneNumber.phoneNumberTypeId;
  }
    
  TraversePortal(portalId: number) : void{
    this.goToNextPortal.emit(portalId);
    this.selectedItemChange.emit(true);
  }

  Save(){
    // Update the upsertPhoneNumber object with current field values
    this.upsertPhoneNumber.phoneNumberValue = this._phoneNumberValue;
    this.upsertPhoneNumber.phoneNumberTypeId = this.phoneNumberType;

    // Call appropriate service function based on add vs update
    if (this.isUpdate)
      this.phoneNumberService.updatePhoneNumber(this.upsertPhoneNumber).subscribe({
        next: (result: PhoneNumber) => {
          console.log('updatePhoneNumber success:', result);
          this.upsertPhoneNumber = result;
        },
        error: (error) => {
          console.error('updatePhoneNumber error:', error);
        }
      });
    else
      if (this.individualId != 0){
        var upsertIndividualPhoneNumber: IndividualPhoneNumbersDto = new IndividualPhoneNumbersDto();
        upsertIndividualPhoneNumber.individualId = this.individualId;
        upsertIndividualPhoneNumber.phoneNumberId = this.upsertPhoneNumber.phoneNumberId;
        upsertIndividualPhoneNumber.phoneNumber = [this.upsertPhoneNumber];
        console.log('Calling AddIndividualToAPhoneNumber with:', upsertIndividualPhoneNumber);
        this.phoneNumberService.addIndividualToAPhoneNumber(upsertIndividualPhoneNumber).subscribe({
          next: (result: IndividualPhoneNumbersDto) => {
            console.log('AddIndividualToAPhoneNumber success:', result);
            upsertIndividualPhoneNumber = result;
          },
          error: (error) => {
            console.error('AddIndividualToAPhoneNumber error:', error);
          }
        });
      } else{
        this.phoneNumberService.addPhoneNumber(this.upsertPhoneNumber).subscribe({
          next: (result: PhoneNumber) => {
            console.log('addPhoneNumber success:', result);
            this.upsertPhoneNumber = result;
          },
          error: (error) => {
            console.error('addPhoneNumber error:', error);
          }
        });
      }

    // Call cancel to reset and exit
    this.Cancel();
  }
  
  // Reset all phoneNumber variables to blank/zero
  Reset(){
    this.upsertPhoneNumber.phoneNumberValue = "";
    this.upsertPhoneNumber.phoneNumberTypeId = 0;
  }

  // Reset values then exit to previous portal
  Cancel(){
    this.Reset();
    var returnPortal = this.navigation.returnToPreviousPortal(this.allPortalNavigation);
    this.goToNextPortal.emit(returnPortal);
  }
  
  GetChosenPhoneNumber() : void{
    let chosenPhoneNumber = document.getElementById("drop-pho") as HTMLSelectElement;
    this.phoneNumberTypeOption = chosenPhoneNumber.selectedIndex;
  }

  SetChosenPhoneNumber(typeId: number) : void{
    let chosenPhoneNumber = document.getElementById("drop-pho") as HTMLSelectElement;
    chosenPhoneNumber.selectedIndex = typeId;
  }
  
}
