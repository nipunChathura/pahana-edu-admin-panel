import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CategoryApiResponse} from './response/CategoryApiResponse';
import {CategoryRequest} from './request/CategoryRequest';
import {BookResponse} from './response/BookResponse';
import {BookRequest} from './request/BookRequest';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly baseUrl = 'http://34.47.130.115:9090/pahana-edu/api/books';

  constructor(private http: HttpClient) {}

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getBookById(userId: number, bookId: number, token: string): Observable<BookResponse> {
    const headers = this.createHeaders(token);

    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('bookId', bookId.toString());

    const url = `${this.baseUrl}/get`; // <-- corrected

    return this.http.get<BookResponse>(url, { headers, params });
  }

  getBooks(userId: number, token: string): Observable<BookResponse> {
    const headers = this.createHeaders(token);
    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<BookResponse>(`${this.baseUrl}/${userId}`, { headers, params });
  }

  saveBook(request: BookRequest, token: string): Observable<BookResponse> {
    const headers = this.createHeaders(token);
    return this.http.post<BookResponse>(`${this.baseUrl}/add`, request, { headers });
  }

  updateBook(request: BookRequest, token: string): Observable<BookResponse> {
    const headers = this.createHeaders(token);
    return this.http.put<BookResponse>(`${this.baseUrl}/update`, request, { headers });
  }

  deleteBook(request: BookRequest, token: string): Observable<BookResponse> {
    const headers = this.createHeaders(token);
    return this.http.delete<BookResponse>(`${this.baseUrl}/delete`, {
      headers,
      body: request
    });
  }
}
