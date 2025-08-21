import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CategoryApiResponse} from './response/CategoryApiResponse';
import {CategoryRequest} from './request/CategoryRequest';
import {GcpResponse} from './response/GcpResponse';

@Injectable({
  providedIn: 'root'
})
export class GcpService {
  private readonly baseUrl = 'http://34.47.130.115:9090/pahana-edu/api/gcp';

  constructor(private http: HttpClient) {}

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  uploadImage(file: File, token: string): Observable<GcpResponse> {
    const headers = this.createHeaders(token);

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<GcpResponse>(`${this.baseUrl}/upload`, formData, { headers });
  }
}
