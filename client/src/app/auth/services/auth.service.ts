import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  login(payload: any) {
  return this.http.post(`${this.baseUrl}/login`, payload);
}

}