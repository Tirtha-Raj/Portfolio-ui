import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { Project } from '../../core/models/project.model';
import { PaginationResponse } from '../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders | undefined {
    const token = this.authService.token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  private params(page = 0, size = 20): HttpParams {
    return new HttpParams().set('page', `${page}`).set('size', `${size}`);
  }

  getAll(page = 0, size = 20): Observable<PaginationResponse<Project>> {
    return this.http.get<PaginationResponse<Project>>(`${this.baseUrl}/projects`, {
      params: this.params(page, size),
      headers: this.getHeaders()
    });
  }

  search(query: string, page = 0, size = 20): Observable<PaginationResponse<Project>> {
    return this.http.get<PaginationResponse<Project>>(`${this.baseUrl}/projects/search`, {
      params: this.params(page, size).set('q', query),
      headers: this.getHeaders()
    });
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`, {
      headers: this.getHeaders()
    });
  }

  getTrendingViews(page = 0, size = 20): Observable<PaginationResponse<Project>> {
    return this.http.get<PaginationResponse<Project>>(`${this.baseUrl}/projects/trending/views`, {
      params: this.params(page, size),
      headers: this.getHeaders()
    });
  }

  getTrendingLikes(page = 0, size = 20): Observable<PaginationResponse<Project>> {
    return this.http.get<PaginationResponse<Project>>(`${this.baseUrl}/projects/trending/likes`, {
      params: this.params(page, size),
      headers: this.getHeaders()
    });
  }

  create(project: Omit<Project, 'id' | 'viewsCount' | 'likesCount' | 'userHasLiked' | 'createdAt' | 'updatedAt'>): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project, {
      headers: this.getHeaders()
    });
  }

  update(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/projects/${id}`, project, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`, {
      headers: this.getHeaders()
    });
  }

  recordView(id: number): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects/${id}/views`, null, {
      headers: this.getHeaders()
    });
  }

  like(id: number): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects/${id}/like`, null, {
      headers: this.getHeaders()
    });
  }

  unlike(id: number): Observable<Project> {
    return this.http.delete<Project>(`${this.baseUrl}/projects/${id}/like`, {
      headers: this.getHeaders()
    });
  }
}
