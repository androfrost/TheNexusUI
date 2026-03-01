import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";
import { IndividualLocationsDto } from "../models/dto/individual-locations-dto";

@Injectable({
  providedIn: 'root'
})

export class IndividualLocationsDtoService {
  private url = "IndividualLocationsDto";
  
  constructor(private http: HttpClient) { }

  public getIndividualLocationsDto() : Observable<IndividualLocationsDto[]> {
    return this.http.get<IndividualLocationsDto[]>(`${environment.APIUrl}/${this.url}`);
  }
}