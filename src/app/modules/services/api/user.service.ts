import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(phone: string, password: string): Observable<any> {
    // return this.http.post<any>(environment.apiUrl + 'user/create', {
    return this.http.post<any>('http://192.168.100.56:4001/api/v1/user/login', {
      auth: {
        app_token: "regOGv2y5BEcS42NiygKQtE5uvu6uxKx1Lr31uKtKlJ35NI6qRrGZH633f2c1c8c3a465ab9e63defPuWd5Otkw3OU6qGNVTBSQ",
      },
      data: {
        phone_number: phone,
        password: password,
      }
    });
  }

  register(first: string, last: string, password: string, phone: string, dob: string, gender: string,): Observable<any> {
    // return this.http.post<any>(environment.apiUrl + 'user/create', {
    return this.http.post<any>('http://192.168.100.56:4001/api/v1/user/register', {
      auth: {
        app_token: "regOGv2y5BEcS42NiygKQtE5uvu6uxKx1Lr31uKtKlJ35NI6qRrGZH633f2c1c8c3a465ab9e63defPuWd5Otkw3OU6qGNVTBSQ",
      },
      data: {
        first_name: first,
        last_name: last,
        phone_number: phone,
        dob: dob,
        gender: gender,
        password: password,
      }
    });
  }

  update(id: string, obj: {}): Observable<any> {
    // return this.http.post<any>(environment.apiUrl + 'user/create', {
    return this.http.post<any>('http://192.168.100.56:4001/api/v1/user/update', {
      auth: {
        app_token: "regOGv2y5BEcS42NiygKQtE5uvu6uxKx1Lr31uKtKlJ35NI6qRrGZH633f2c1c8c3a465ab9e63defPuWd5Otkw3OU6qGNVTBSQ",
      },
      data: {
        search_criteria: {
          id: id
        },
        update_params: obj
      }
    });
  }
}
