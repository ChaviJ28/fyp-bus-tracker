import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusRoutesService {

  constructor(private http: HttpClient) { }

  list(searchCriteria: any): Observable<any> {
    // return this.http.post<any>(environment.apiUrl + 'user/create', {
    return this.http.post<any>('http://192.168.100.56:4001/api/v1/bus-routes/list', {
      auth: {
        app_token: "regOGv2y5BEcS42NiygKQtE5uvu6uxKx1Lr31uKtKlJ35NI6qRrGZH633f2c1c8c3a465ab9e63defPuWd5Otkw3OU6qGNVTBSQ",
      },
      data: {
        search_criteria: searchCriteria
      }
    });
  }
}
