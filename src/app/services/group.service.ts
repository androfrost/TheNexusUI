import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environment/environment";
import { Observable } from 'rxjs/internal/Observable';
import { Group } from "../models/group";
//import { HttpClientModule } from '@angular/common/http';  

@Injectable({
  providedIn: 'root'
})

export class GroupService {
  private url = "Group";
  
  constructor(private http: HttpClient) { }

  public getGroups() : Observable<Group[]> {
    return this.http.get<Group[]>(`${environment.APIUrl}/${this.url}`);
  }

  public getGroupByGroupId(groupId: number) : Observable<Group> {
    return this.http.get<Group>(`${environment.APIUrl}/${groupId}/${this.url}`);
  }

  public updateGroup(group: Group) : Observable<Group> {
    return this.http.put<Group>(`${environment.APIUrl}/${this.url}`, group);
  }

  public addGroup(group: Group) : Observable<Group> {
    return this.http.post<Group>(`${environment.APIUrl}/${this.url}`, group);
  }
}