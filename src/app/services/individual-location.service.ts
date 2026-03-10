import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";
import { IndividualLocation } from "../models/individual-location";

@Injectable({
  providedIn: 'root'
})

export class IndividualLocationService {
    private url = "IndividualLocation";

    constructor(private http: HttpClient) { }

    public addIndividualLocation(individualLocation: { individualId: number; locationId: number }): Observable<void> {
        return this.http.post<void>(`${environment.APIUrl}/${this.url}`, individualLocation);
    }

    public deleteIndividualLocationByIndividualAndLocationId(individualId: number, locationId: number) : Observable<void> {
        const url = `${environment.APIUrl}/${this.url}/IndividualLocationDelete/${individualId}/${locationId}`;
        return this.http.delete<void>(url);
    }
}