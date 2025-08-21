import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomerResponse} from './response/CustomerResponse';
import {PromotionResponse} from './response/PromotionResponse';
import {CustomerRequest} from './request/CustomerRequest';
import {PromotionRequest} from './request/PromotionRequest';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private readonly baseUrl = 'http://34.47.130.115:9090/pahana-edu/api/promotions';

  constructor(private http: HttpClient) {}

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getPromotions(userId: number, requestBookDetails: boolean, token: string): Observable<PromotionResponse> {
    const headers = this.createHeaders(token);
    const params =
      new HttpParams()
        .set('userId', userId.toString())
        .set('requestBookDetails', requestBookDetails.toString());

    return this.http.get<PromotionResponse>(`${this.baseUrl}/all/${userId}`, { headers, params });
  }

  getPromotionsById(userId: number, promotionId: number, requestBookDetails: boolean, token: string): Observable<PromotionResponse> {
    const headers = this.createHeaders(token);
    const params =
      new HttpParams()
        .set('requestBookDetails', userId.toString())
        .set('promotionId', promotionId.toString());

    return this.http.get<PromotionResponse>(`${this.baseUrl}/id/${userId}`, { headers, params });
  }

  savePromotion(request: PromotionRequest, token: string): Observable<PromotionResponse> {
    const headers = this.createHeaders(token);
    return this.http.post<PromotionResponse>(`${this.baseUrl}/add`, request, { headers });
  }

  updatePromotion(request: PromotionRequest, token: string): Observable<PromotionResponse> {
    const headers = this.createHeaders(token);
    return this.http.put<PromotionResponse>(`${this.baseUrl}/update`, request, { headers });
  }

  deletePromotion(request: PromotionRequest, token: string): Observable<PromotionResponse> {
    const headers = this.createHeaders(token);
    return this.http.delete<PromotionResponse>(`${this.baseUrl}/delete`, {
      headers,
      body: request
    });
  }

  addBook(userId: number, promotionId: number, bookId: number, token: string): Observable<PromotionResponse> {
    const headers = this.createHeaders(token);
    const params =
      new HttpParams()
        .set('requestBookDetails', userId.toString())
        .set('promotionId', promotionId.toString());
    return this.http.patch<PromotionResponse>(`${this.baseUrl}/add/book/${userId}`, {
      headers,
      params
    });
  }

  removeBook(userId: number, promotionId: number, bookId: number, token: string): Observable<PromotionResponse> {
    const headers = this.createHeaders(token);
    const params =
      new HttpParams()
        .set('requestBookDetails', userId.toString())
        .set('promotionId', promotionId.toString());
    return this.http.patch<PromotionResponse>(`${this.baseUrl}/remove/book/${userId}`, {
      headers,
      params
    });
  }
}
