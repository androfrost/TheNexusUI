import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";
import { IndividualPhoneNumber } from "../models/individual-phone-number";

@Injectable({
  providedIn: 'root'
})

export class IndividualPhoneNumberService {
    private url = "IndividualPhoneNumber";

    constructor(private http: HttpClient) { }

    public addIndividualPhoneNumber(individualPhoneNumber: { individualId: number; phoneNumberId: number }): Observable<void> {
        return this.http.post<void>(`${environment.APIUrl}/${this.url}`, individualPhoneNumber);
    }

    public deleteIndividualPhoneNumberByIndividualAndPhoneNumberId(individualId: number, phoneNumberId: number) : Observable<void> {
        const url = `${environment.APIUrl}/${this.url}/IndividualPhoneNumberDelete/${individualId}/${phoneNumberId}`;
        return this.http.delete<void>(url);
    }
}