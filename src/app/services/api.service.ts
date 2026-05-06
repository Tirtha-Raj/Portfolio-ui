import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface PaginationResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;
  githubUrl?: string;
  liveUrl?: string;
  viewsCount: number;
  likesCount: number;
  userHasLiked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  views: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private authHeaders(): HttpHeaders | undefined {
    const token = this.authService.token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  private params(page = 0, size = 20): HttpParams {
    return new HttpParams().set('page', `${page}`).set('size', `${size}`);
  }

  getProjects(page = 0, size = 20): Observable<PaginationResponse<Project>> {
    return this.http.get<PaginationResponse<Project>>(`${this.baseUrl}/projects`, {
      params: this.params(page, size),
      headers: this.authHeaders()
    });
  }

  searchProjects(query: string, page = 0, size = 20): Observable<PaginationResponse<Project>> {
    return this.http.get<PaginationResponse<Project>>(`${this.baseUrl}/projects/search`, {
      params: this.params(page, size).set('q', query),
      headers: this.authHeaders()
    });
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`, {
      headers: this.authHeaders()
    });
  }

  incrementProjectViews(id: number): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects/${id}/views`, null, {
      headers: this.authHeaders()
    });
  }

  likeProject(id: number): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects/${id}/like`, null, {
      headers: this.authHeaders()
    });
  }

  unlikeProject(id: number): Observable<Project> {
    return this.http.delete<Project>(`${this.baseUrl}/projects/${id}/like`, {
      headers: this.authHeaders()
    });
  }

  getBlogs(page = 0, size = 20): Observable<PaginationResponse<Blog>> {
    return this.http.get<PaginationResponse<Blog>>(`${this.baseUrl}/blogs`, {
      params: this.params(page, size)
    });
  }

  getBlogById(id: number): Observable<Blog> {
    return this.getBlogs(0, 100).pipe(
      map((response) => {
        const blog = response.content.find((item) => item.id === id);
        if (!blog) {
          throw new Error('Blog not found');
        }
        return blog;
      })
    );
  }

  incrementBlogViews(id: number): Observable<Blog> {
    return this.http.post<Blog>(`${this.baseUrl}/blogs/${id}/views`, null);
  }

  sendContact(request: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.baseUrl}/contact`, request);
  }

  getAdminContactMessages(page = 0, size = 20): Observable<PaginationResponse<ContactResponse>> {
    return this.http.get<PaginationResponse<ContactResponse>>(`${this.baseUrl}/admin/contact/messages`, {
      params: this.params(page, size),
      headers: this.authHeaders()
    });
  }
}
