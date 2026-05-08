import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { Skill } from '../../core/models/skill.model';
import { PaginationResponse } from '../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class SkillsApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders | undefined {
    const token = this.authService.token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  private params(page = 0, size = 20): HttpParams {
    return new HttpParams().set('page', `${page}`).set('size', `${size}`);
  }

  getAll(page = 0, size = 20): Observable<PaginationResponse<Skill>> {
    return this.http.get<PaginationResponse<Skill>>(`${this.baseUrl}/skills`, {
      params: this.params(page, size)
    });
  }

  create(skill: Omit<Skill, 'id' | 'createdAt'>): Observable<Skill> {
    return this.http.post<Skill>(`${this.baseUrl}/skills`, skill, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/skills/${id}`, {
      headers: this.getHeaders()
    });
  }
}
