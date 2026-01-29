import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BorrowerService {
  private borrowerBaseUrl = `${environment.apiBaseUrl}/borrows`;
  private borrowToolsBaseUrl = `${environment.apiBaseUrl}/tools`;

  constructor(private http: HttpClient) {}

  //   Tool Borrower
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.borrowerBaseUrl);
  }

  getOne(borrowuuid: string): Observable<any> {
    return this.http.get<any>(`${this.borrowerBaseUrl}/${borrowuuid}`);
  }

  returnTool(borrowuuid: string): Observable<any> {
    return this.http.post(`${this.borrowerBaseUrl}/${borrowuuid}`, {});
  }

  //   Borrow Tools
  getAvailableTools() {
    return this.http.get<any[]>(this.borrowToolsBaseUrl);
  }

  getToolInfo(tooluuid: string) {
    return this.http.get<any>(`${this.borrowToolsBaseUrl}/${tooluuid}`);
  }

  borrowTool(
    tooluuid: string,
    payload: {
      lenderuuid: string;
      quantity: number;
      startDate: string;
      dueDate: string;
    },
  ) {
    return this.http.post(`${this.borrowToolsBaseUrl}/${tooluuid}`, payload);
  }
}
