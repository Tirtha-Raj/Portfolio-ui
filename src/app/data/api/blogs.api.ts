import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { Blog } from '../../core/models/blog.model';
import { PaginationResponse } from '../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class BlogsApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders | undefined {
    const token = this.authService.token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  private params(page = 0, size = 20): HttpParams {
    return new HttpParams().set('page', `${page}`).set('size', `${size}`);
  }

  getAll(page = 0, size = 20): Observable<PaginationResponse<Blog>> {
    return this.http.get<PaginationResponse<Blog>>(`${this.baseUrl}/blogs`, {
      params: this.params(page, size)
    });
  }

  getById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.baseUrl}/blogs/${id}`);
  }

  create(blog: Omit<Blog, 'id' | 'views' | 'createdAt' | 'updatedAt'>): Observable<Blog> {
    return this.http.post<Blog>(`${this.baseUrl}/admin/blogs`, blog, {
      headers: this.getHeaders()
    });
  }

  recordView(id: number): Observable<Blog> {
    return this.http.post<Blog>(`${this.baseUrl}/blogs/${id}/views`, null);
  }
}
