import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { PaginationResponse } from '../../core/models/pagination.model';

export interface AnalyticsEvent {
  id: number;
  eventType: string;
  pageName: string;
  userId?: number;
  username?: string;
  projectId?: number;
  searchQuery?: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalLikes: number;
  totalEvents: number;
  activeUsers: number;
}

export interface ProjectAnalytics {
  projectId: number;
  projectTitle: string;
  viewsCount: number;
  likesCount: number;
  dailyViews: Array<{ date: string; count: number }>;
}

export interface PageAnalytics {
  pageName: string;
  viewsCount: number;
  uniqueVisitors: number;
}

export interface UserActivity {
  userId: number;
  username: string;
  email: string;
  projectsViewed: number;
  projectsLiked: number;
  messagesCount: number;
  lastActivityDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders | undefined {
    const token = this.authService.token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  private params(page = 0, size = 20): HttpParams {
    return new HttpParams().set('page', `${page}`).set('size', `${size}`);
  }

  trackEvent(eventType: string, pageName: string, projectId?: number, searchQuery?: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/analytics/events`, {
      eventType,
      pageName,
      projectId,
      searchQuery
    });
  }

  getSummary(): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(`${this.baseUrl}/admin/analytics/summary`, {
      headers: this.getHeaders()
    });
  }

  getEvents(page = 0, size = 20, eventType?: string, pageName?: string): Observable<PaginationResponse<AnalyticsEvent>> {
    let params = this.params(page, size);
    if (eventType) params = params.set('eventType', eventType);
    if (pageName) params = params.set('pageName', pageName);

    return this.http.get<PaginationResponse<AnalyticsEvent>>(`${this.baseUrl}/admin/analytics/events`, {
      params,
      headers: this.getHeaders()
    });
  }

  getProjectAnalytics(projectId: number): Observable<ProjectAnalytics> {
    return this.http.get<ProjectAnalytics>(`${this.baseUrl}/admin/analytics/projects/${projectId}`, {
      headers: this.getHeaders()
    });
  }

  getPageAnalytics(pageName: string): Observable<PageAnalytics> {
    return this.http.get<PageAnalytics>(`${this.baseUrl}/admin/analytics/pages/${pageName}`, {
      headers: this.getHeaders()
    });
  }

  getUserActivity(userId: number): Observable<UserActivity> {
    return this.http.get<UserActivity>(`${this.baseUrl}/admin/analytics/users/${userId}`, {
      headers: this.getHeaders()
    });
  }
}
