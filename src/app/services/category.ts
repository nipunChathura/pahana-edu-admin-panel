import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryApiResponse } from './response/CategoryApiResponse';
import { CategoryRequest } from './request/CategoryRequest';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = 'http://localhost:9090/pahana-edu/api/categories';

  constructor(private http: HttpClient) {}

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getCategories(userId: number, token: string): Observable<CategoryApiResponse> {
    const headers = this.createHeaders(token);
    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<CategoryApiResponse>(`${this.baseUrl}`, { headers, params });
  }

  saveCategory(request: CategoryRequest, token: string): Observable<CategoryApiResponse> {
    const headers = this.createHeaders(token);
    return this.http.post<CategoryApiResponse>(`${this.baseUrl}/add`, request, { headers });
  }

  updateCategory(request: CategoryRequest, token: string): Observable<CategoryApiResponse> {
    const headers = this.createHeaders(token);
    return this.http.put<CategoryApiResponse>(`${this.baseUrl}/update`, request, { headers });
  }

  deleteCategory(request: CategoryRequest, token: string): Observable<CategoryApiResponse> {
    const headers = this.createHeaders(token);
    return this.http.delete<CategoryApiResponse>(`${this.baseUrl}/delete`, {
      headers,
      body: request
    });
  }
}
