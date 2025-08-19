import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CategoryRequest} from './request/CategoryRequest';
import {UserResponse} from './response/UserResponse';
import {UserRequest} from './request/UserRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:9090/pahana-edu/api/users';

  constructor(private http: HttpClient) {}

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUsers(userId: number, token: string): Observable<UserResponse> {
    const headers = this.createHeaders(token);
    // const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<UserResponse>(`${this.baseUrl}/all/${userId}`, { headers });
  }

  saveUser(request: UserRequest, token: string): Observable<UserResponse> {
    const headers = this.createHeaders(token);
    return this.http.post<UserResponse>(`${this.baseUrl}/add`, request, { headers });
  }

  updateUser(request: UserRequest, token: string): Observable<UserResponse> {
    const headers = this.createHeaders(token);
    return this.http.put<UserResponse>(`${this.baseUrl}/update`, request, { headers });
  }

  deleteUser(userId: number, token: string): Observable<UserResponse> {
    const headers = this.createHeaders(token);
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<UserResponse>(`${this.baseUrl}/delete`, {
      headers, params
    });
  }
}
