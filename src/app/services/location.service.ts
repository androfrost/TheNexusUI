import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environment/environment";
import { Observable } from 'rxjs/internal/Observable';
import { Location } from "../models/location";
import { IndividualLocationsDto } from '../models/dto/individual-locations-dto';
import { LocationsWithAssignedIndividualDto } from '../models/dto/locations-with-assigned-individual-dto';
//import { HttpClientModule } from '@angular/common/http';  

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  private url = "Location";
  
  constructor(private http: HttpClient) { }

  public getLocations() : Observable<Location[]> {
    return this.http.get<Location[]>(`${environment.APIUrl}/${this.url}`);
  }

  public getLocationByLocationId(locationId: number) : Observable<Location> {
    return this.http.get<Location>(`${environment.APIUrl}/${locationId}/${this.url}`);
  }

  public getLocationsByIndividualId(individualId: number) : Observable<Location[]> { 
    return this.http.get<Location[]>(`${environment.APIUrl}/${this.url}/IndividualsLocations/${individualId}`);
  }

  public getIndividualLocationsByIndividualId(individualId: number) : Observable<IndividualLocationsDto> {
    return this.http.get<IndividualLocationsDto>(`${environment.APIUrl}/${this.url}/IndividualLocations/${individualId}`);
  }

  public getLocationsWithAssignedIndividualsByIndividualId(individualId: number) : Observable<LocationsWithAssignedIndividualDto[]> {
    return this.http.get<LocationsWithAssignedIndividualDto[]>(`${environment.APIUrl}/${this.url}/GetIndividualsLocationWithAssignedIndividual/${individualId}`);
  }


  public updateLocation(location: Location) : Observable<Location> {
    return this.http.put<Location>(`${environment.APIUrl}/${this.url}`, location);
  }

  public addLocation(location: Location) : Observable<Location> {
    return this.http.post<Location>(`${environment.APIUrl}/${this.url}`, location);
  }

  public addIndividualToALocation(individualLocationDto: IndividualLocationsDto) : Observable<IndividualLocationsDto> {
    const url = `${environment.APIUrl}/${this.url}/IndividualLocation`;
    return this.http.post<IndividualLocationsDto>(url, individualLocationDto);
  }

  public removeIndividualFromALocation(individualId: number, locationId: number) : Observable<void> {
    const url = `${environment.APIUrl}/${this.url}/IndividualLocation/${individualId}/${locationId}`;
    return this.http.delete<void>(url);
  }
}