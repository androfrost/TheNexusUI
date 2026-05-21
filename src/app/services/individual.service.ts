import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environment/environment";
import { Observable } from 'rxjs/internal/Observable';
import { Individual } from "../models/individual";
import { ApiToasts } from '../helpers/api-toasts';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})

export class IndividualService {
  private url = "Individual";
  ApiToasts: ApiToasts;
  
  constructor(private http: HttpClient, private toastService: ToastService) {
    this.ApiToasts = new ApiToasts(this.toastService);
  }

  public getIndividuals() : Observable<Individual[]> {
    return this.http.get<Individual[]>(`${environment.APIUrl}/${this.url}`);
  }

  public getIndividualByIndividualId(individualId: number) : Observable<Individual> {
    return this.http.get<Individual>(`${environment.APIUrl}/${individualId}/${this.url}`);
  }

  public getIndividualsByStatusId(statusId: number) : Observable<Individual[]> {
    return this.http.get<Individual[]>(`${environment.APIUrl}/${this.url}/status/${statusId}`);
  }

  public updateIndividual(individual: Individual) : Observable<Individual> {
    return this.http.put<Individual>(`${environment.APIUrl}/${this.url}`, individual);
  }

  public addIndividual(individual: Individual) : Observable<Individual> {
    return this.http.post<Individual>(`${environment.APIUrl}/${this.url}`, individual);
  }
}