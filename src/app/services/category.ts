import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CategoryDto} from './dto/CategoryDto';
import {CategoryApiResponse} from './response/CategoryApiResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService  {
  private baseUrl = 'http://localhost:9090/pahana-edu/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(userId: number, token: string): Observable<CategoryApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<CategoryApiResponse>(this.baseUrl, { headers, params });
  }
}
