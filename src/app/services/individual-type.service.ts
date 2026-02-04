import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";
import { IndividualType } from "../models/individual-type";

@Injectable({
  providedIn: 'root'
})

export class IndividualTypeService {
    private url = "IndividualType";

    constructor(private http: HttpClient) { }

    public getIndividualTypes() : Observable<IndividualType[]> {
        return this.http.get<IndividualType[]>(`${environment.APIUrl}/${this.url}`);
      }
}