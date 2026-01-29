import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToolsService {

  private toolsBaseUrl = `${environment.apiBaseUrl}/lender/tools`;
  private borrowsBaseUrl = `${environment.apiBaseUrl}/lender/borrows`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.toolsBaseUrl);
  }

  create(payload: any): Observable<any> {
    return this.http.post(this.toolsBaseUrl, payload);
  }

  update(toolUuid: string, payload: any): Observable<any> {
    return this.http.patch(
      `${this.toolsBaseUrl}/${toolUuid}`,
      payload
    );
  }

  delete(toolUuid: string): Observable<any> {
    return this.http.delete(
      `${this.toolsBaseUrl}/${toolUuid}`
    );
  }

  getAllBorrows(): Observable<any[]> {
    return this.http.get<any[]>(this.borrowsBaseUrl);
  }

  getBorrowById(borrowUuid: string): Observable<any> {
    return this.http.get<any>(
      `${this.borrowsBaseUrl}/${borrowUuid}`
    );
  }

  approveReturn(borrowUuid: string): Observable<any> {
    return this.http.post(
      `${this.borrowsBaseUrl}/${borrowUuid}/approve-return`,
      {}
    );
  }
}
