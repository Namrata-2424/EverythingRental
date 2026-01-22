import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  getMyProfile() {
    const token = localStorage.getItem('accessToken');

    return this.http.get(`${this.baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updatePersonalInfo(data: any) {
    const token = localStorage.getItem('accessToken');

    return this.http.patch(`${this.baseUrl}/me`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateAddress(addressId: string, data: any) {
    const token = localStorage.getItem('accessToken');

    return this.http.patch(`${this.baseUrl}/me/address/${addressId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
