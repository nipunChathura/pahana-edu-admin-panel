import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomerResponse} from './response/CustomerResponse';
import {DashboardResponse} from './response/DashboardResponse';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = 'http://localhost:9090/pahana-edu/api/dashboard';

  constructor(private http: HttpClient) {}

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getDashboardData(userId: number, token: string): Observable<DashboardResponse> {
    const headers = this.createHeaders(token);
    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<DashboardResponse>(`${this.baseUrl}/${userId}`, { headers, params });
  }
}
