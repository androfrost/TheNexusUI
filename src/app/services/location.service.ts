import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environment/environment";
import { Observable } from 'rxjs/internal/Observable';
import { Location } from "../models/location";
import { IndividualLocationDto } from '../models/dto/individual-location-dto';
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

  public updateLocation(location: Location) : Observable<Location> {
    return this.http.put<Location>(`${environment.APIUrl}/${this.url}`, location);
  }

  public addLocation(location: Location) : Observable<Location> {
    return this.http.post<Location>(`${environment.APIUrl}/${this.url}`, location);
  }

  public AddIndividualToALocation(individualLocationDto: IndividualLocationDto) : Observable<IndividualLocationDto> {
    const url = `${environment.APIUrl}/${this.url}/IndividualLocation`;
    return this.http.post<IndividualLocationDto>(url, individualLocationDto);
  }
}