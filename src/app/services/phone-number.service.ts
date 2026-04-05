import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environment/environment";
import { Observable } from 'rxjs/internal/Observable';
import { PhoneNumber } from "../models/phone-number";
import { IndividualPhoneNumbersDto } from '../models/dto/individual-phone-number-dto';
import { PhoneNumbersWithAssignedIndividualDto } from '../models/dto/phone-numbers-with-assigned-individual-dto';

@Injectable({
  providedIn: 'root'
})

export class PhoneNumberService {
  private url = "PhoneNumber";
  
  constructor(private http: HttpClient) { }

  public getPhoneNumbers() : Observable<PhoneNumber[]> {
    return this.http.get<PhoneNumber[]>(`${environment.APIUrl}/${this.url}`);
  }

  public getPhoneNumberByPhoneNumberId(phonenumberId: number) : Observable<PhoneNumber> {
    return this.http.get<PhoneNumber>(`${environment.APIUrl}/${phonenumberId}/${this.url}`);
  }

  public getPhoneNumbersByIndividualId(individualId: number) : Observable<PhoneNumber[]> { 
    return this.http.get<PhoneNumber[]>(`${environment.APIUrl}/${this.url}/IndividualsPhoneNumbers/${individualId}`);
  }

  public getPhoneNumbersWithAssignedIndividualsByIndividualId(individualId: number) : Observable<PhoneNumbersWithAssignedIndividualDto[]> {
    return this.http.get<PhoneNumbersWithAssignedIndividualDto[]>(`${environment.APIUrl}/${this.url}/GetIndividualsPhoneNumberWithAssignedIndividual/${individualId}`);
  }


  public updatePhoneNumber(phonenumber: PhoneNumber) : Observable<PhoneNumber> {
    return this.http.put<PhoneNumber>(`${environment.APIUrl}/${this.url}`, phonenumber);
  }

  public addPhoneNumber(phonenumber: PhoneNumber) : Observable<PhoneNumber> {
    return this.http.post<PhoneNumber>(`${environment.APIUrl}/${this.url}`, phonenumber);
  }

  public addIndividualToAPhoneNumber(individualPhoneNumberDto: IndividualPhoneNumbersDto) : Observable<IndividualPhoneNumbersDto> {
    const url = `${environment.APIUrl}/${this.url}/IndividualPhoneNumber`;
    return this.http.post<IndividualPhoneNumbersDto>(url, individualPhoneNumberDto);
  }

  public removeIndividualFromAPhoneNumber(individualId: number, phonenumberId: number) : Observable<void> {
    const url = `${environment.APIUrl}/${this.url}/IndividualPhoneNumber/${individualId}/${phonenumberId}`;
    return this.http.delete<void>(url);
  }
}