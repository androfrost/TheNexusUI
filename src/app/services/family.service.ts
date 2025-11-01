import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environment/environment";
import { Observable } from 'rxjs/internal/Observable';
import { Family } from "../models/family";
//import { HttpClientModule } from '@angular/common/http';  

@Injectable({
  providedIn: 'root'
})

export class FamilyService {
  private url = "Family";
  
  constructor(private http: HttpClient) { }

  public getFamilies() : Observable<Family[]> {
    return this.http.get<Family[]>(`${environment.APIUrl}/${this.url}`);
  }

  public getFamilyByFamilyId(familyId: number) : Observable<Family> {
    return this.http.get<Family>(`${environment.APIUrl}/${familyId}/${this.url}`);
  }

  public updateFamily(family: Family) : Observable<Family> {
    return this.http.put<Family>(`${environment.APIUrl}/${this.url}`, family);
  }

  public addFamily(family: Family) : Observable<Family> {
    return this.http.post<Family>(`${environment.APIUrl}/${this.url}`, family);
  }
}