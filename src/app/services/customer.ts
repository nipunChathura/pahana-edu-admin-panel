import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomerResponse} from './response/CustomerResponse';
import {CustomerRequest} from './request/CustomerRequest';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly baseUrl = 'http://localhost:9090/pahana-edu/api/customers';

  constructor(private http: HttpClient) {}

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getCustomer(userId: number, token: string): Observable<CustomerResponse> {
    const headers = this.createHeaders(token);
    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<CustomerResponse>(`${this.baseUrl}/all/${userId}`, { headers, params });
  }

  saveCustomer(request: CustomerRequest, token: string): Observable<CustomerResponse> {
    const headers = this.createHeaders(token);
    return this.http.post<CustomerResponse>(`${this.baseUrl}/add`, request, { headers });
  }

  updateCustomer(request: CustomerRequest, token: string): Observable<CustomerResponse> {
    const headers = this.createHeaders(token);
    return this.http.put<CustomerResponse>(`${this.baseUrl}/update`, request, { headers });
  }

  deleteCustomer(request: CustomerRequest, token: string): Observable<CustomerResponse> {
    const headers = this.createHeaders(token);
    return this.http.delete<CustomerResponse>(`${this.baseUrl}/delete`, {
      headers,
      body: request
    });
  }
}
