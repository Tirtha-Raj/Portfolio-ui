import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Add JWT token to requests
    const token = this.authService.token;
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized - try refresh token
        if (error.status === 401 && !this.isRefreshing) {
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.isRefreshing = true;

    const authState = this.authService['authState'];
    const refreshToken = authState.value?.refreshToken;

    if (!refreshToken) {
      this.authService.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.authService.refreshToken(refreshToken).pipe(
      switchMap((response) => {
        this.isRefreshing = false;
        const newRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${response.accessToken}`
          }
        });
        return next.handle(newRequest);
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }
}
