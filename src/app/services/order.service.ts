import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomerResponse} from './response/CustomerResponse';
import {CustomerRequest} from './request/CustomerRequest';
import {OrderResponse} from './response/OrderResponse';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = 'http://localhost:9090/pahana-edu/api/orders';

  constructor(private http: HttpClient) {}

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getOrders(userId: number, detailsRequested: boolean, token: string): Observable<OrderResponse> {
    const headers = this.createHeaders(token);
    const params =
      new HttpParams()
        .set('userId', userId.toString())
        .set('detailsRequested', detailsRequested);

    return this.http.get<OrderResponse>(`${this.baseUrl}/all`, { headers, params });
  }
}
