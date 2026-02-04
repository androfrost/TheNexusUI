import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '../../models/location';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { HttpClientModule } from '@angular/common/http';
import { portal } from '../../enum/portal';
import { Navigation } from '../../helpers/navigation';
import { IndividualLocationDto } from '../../models/dto/individual-location-dto';

@Component({
  selector: 'app-location-upsert',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './location-upsert.component.html',
  styleUrl: './location-upsert.component.css',
  providers: [LocationService]
})
export class LocationUpsertComponent {

  portal = portal;

  @Input() upsertLocation : Location = new Location();
  @Input() individualId: number = 0;
  @Input() allPortalNavigation: number[] = [];

  @Output() goToNextPortal = new EventEmitter<number>();
  @Output() selectedItemChange = new EventEmitter<boolean>();

  locationName: string = "";
  address: string = '';
  city: string = "";
  state: string = "";
  zip: string = "";

  isUpdate: boolean = false;
  navigation = Navigation

  constructor(private locationService: LocationService) {  }

  ngOnInit(): void{
    // Determine if this is an update or add based on presence of LocationId
    // If update, set all fields to match the input location
    // If add, reset all fields to blank/zero
    if (this.upsertLocation.locationId > 0){
      this.isUpdate = true;
    }else{
      this.isUpdate = false;
      this.upsertLocation = new Location();
    }
    this.locationName = this.upsertLocation.locationName;
    this.address = this.upsertLocation.address;
    this.city = this.upsertLocation.city;
    this.state = this.upsertLocation.state;
    this.zip = this.upsertLocation.zip;
  }

  TraversePortal(portalId: number) : void{
    this.goToNextPortal.emit(portalId);
    this.selectedItemChange.emit(true);
  }

  // Save the location via the service, either adding or updating as needed
  Save(){
    // Update the upsertLocation object with current field values
    this.upsertLocation.locationName = this.locationName;
    this.upsertLocation.address = this.address;
    this.upsertLocation.city = this.city;
    this.upsertLocation.state = this.state;
    this.upsertLocation.zip = this.zip;

    // Call appropriate service function based on add vs update
    if (this.isUpdate)
      this.locationService.updateLocation(this.upsertLocation).subscribe({
        next: (result: Location) => {
          console.log('updateLocation success:', result);
          this.upsertLocation = result;
        },
        error: (error) => {
          console.error('updateLocation error:', error);
        }
      });
    else
      if (this.individualId != 0){
        var upsertIndividualLocation: IndividualLocationDto = new IndividualLocationDto();
        upsertIndividualLocation.individualId = this.individualId;
        upsertIndividualLocation.locationId = this.upsertLocation.locationId;
        upsertIndividualLocation.location = [this.upsertLocation];
        console.log('Calling AddIndividualToALocation with:', upsertIndividualLocation);
        this.locationService.AddIndividualToALocation(upsertIndividualLocation).subscribe({
          next: (result: IndividualLocationDto) => {
            console.log('AddIndividualToALocation success:', result);
            upsertIndividualLocation = result;
          },
          error: (error) => {
            console.error('AddIndividualToALocation error:', error);
          }
        });
      } else{
        this.locationService.addLocation(this.upsertLocation).subscribe({
          next: (result: Location) => {
            console.log('addLocation success:', result);
            this.upsertLocation = result;
          },
          error: (error) => {
            console.error('addLocation error:', error);
          }
        });
      }

    // Call cancel to reset and exit
    this.Cancel();
  }
  
  // Reset all location variables to blank/zero
  Reset(){
    this.upsertLocation.locationName = "";
    this.upsertLocation.address = "";
    this.upsertLocation.city = "";
    this.upsertLocation.state = "";
    this.upsertLocation.zip = "";
  }

  // Reset values then exit to previous portal
  Cancel(){
    this.Reset();
    var returnPortal = this.navigation.returnToPreviousPortal(this.allPortalNavigation);
    this.goToNextPortal.emit(returnPortal);
  }
}
