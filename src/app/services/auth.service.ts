import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserDto;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'portfolio-auth';
  private readonly baseUrl = environment.apiUrl;
  private authState = new BehaviorSubject<AuthResponse | null>(null);
  auth$ = this.authState.asObservable();

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  get token(): string | null {
    return this.authState.value?.accessToken ?? null;
  }

  get user(): UserDto | null {
    return this.authState.value?.user ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, request).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/signup`, request).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  logout(): void {
    this.clearSession();
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.authState.next(JSON.parse(saved));
      } catch {
        this.clearSession();
      }
    }
  }

  private storeSession(response: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(response));
    }
    this.authState.next(response);
  }

  private clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
    this.authState.next(null);
  }
}
