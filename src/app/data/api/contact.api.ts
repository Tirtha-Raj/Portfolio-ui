import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ContactRequest, ContactResponse } from '../../core/models/contact.model';
import { PaginationResponse } from '../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ContactApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders | undefined {
    const token = this.authService.token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  private params(page = 0, size = 20): HttpParams {
    return new HttpParams().set('page', `${page}`).set('size', `${size}`);
  }

  send(request: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.baseUrl}/contact`, request);
  }

  getAdminMessages(page = 0, size = 20): Observable<PaginationResponse<ContactResponse>> {
    return this.http.get<PaginationResponse<ContactResponse>>(`${this.baseUrl}/admin/contact/messages`, {
      params: this.params(page, size),
      headers: this.getHeaders()
    });
  }
}
