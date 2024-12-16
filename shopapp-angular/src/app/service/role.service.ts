import { Injectable } from '@angular/core';
import {   provideHttpClient ,HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private apiGetRoles  = `${environment.apiBaseurl}/roles`;
  
    constructor(private http: HttpClient) { }
    getRoles():Observable<any> {
      return this.http.get<any[]>(this.apiGetRoles);
    }
  }