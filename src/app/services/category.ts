import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CategoryDto} from './dto/CategoryDto';
import {CategoryApiResponse} from './response/CategoryApiResponse';
import {CategoryRequest} from './request/CategoryRequest';

@Injectable({
  providedIn: 'root'
})
export class CategoryService  {
  private baseUrl = 'http://localhost:9090/pahana-edu/api/categories';
  private addBaseUrl = 'http://localhost:9090/pahana-edu/api/categories/add';
  private updateBaseUrl = 'http://localhost:9090/pahana-edu/api/categories/update';
  private deleteBaseUrl = 'http://localhost:9090/pahana-edu/api/categories/delete';

  constructor(private http: HttpClient) {}

  getCategories(userId: number, token: string): Observable<CategoryApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<CategoryApiResponse>(this.baseUrl, { headers, params });
  }

  saveCategory(request: CategoryRequest, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(this.addBaseUrl, request, { headers });
  }

  updateCategory(request: CategoryRequest, token: string): Observable<CategoryApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(this.updateBaseUrl, request, { headers });
  }

  deleteCategory(request: CategoryRequest, token: string): Observable<CategoryApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<CategoryApiResponse>(this.deleteBaseUrl, {
      headers,
      body: request
    });
  }

}
