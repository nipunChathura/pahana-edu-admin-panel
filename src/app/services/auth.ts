import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthResponse} from './response/AuthResponse';
import {AuthRequest} from './request/AuthRequest';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private loginUrl = 'http://localhost:9090/pahana-edu/api/auth/login';
  private registerUrl = 'http://localhost:9090/pahana-edu/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginUrl, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('userId', String(response.userId));
      })
    );
  }

  register(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.registerUrl}/register`, authRequest);
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
