import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})

export class IndividualLocationService {
    private url = "IndividualLocation";

    constructor(private http: HttpClient) { }

    public deleteIndividualLocationByIndividualAndLocationId(individualId: number, locationId: number) : Observable<void> {
        const url = `${environment.APIUrl}/${this.url}/IndividualLocationDelete/${individualId}/${locationId}`;
        return this.http.delete<void>(url);
    }
}