import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <!-- Header -->
          <div class="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
            <span class="icon">✕</span>
            {{ errorMessage }}
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <!-- Email Field -->
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="form-control"
                placeholder="you@example.com"
                [class.is-invalid]="isFieldInvalid('email')"
              />
              <span *ngIf="isFieldInvalid('email')" class="form-error">
                <span *ngIf="loginForm.get('email')?.hasError('required')">Email is required</span>
                <span *ngIf="loginForm.get('email')?.hasError('email')">Please enter a valid email</span>
              </span>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="form-control"
                placeholder="Your password"
                [class.is-invalid]="isFieldInvalid('password')"
              />
              <span *ngIf="isFieldInvalid('password')" class="form-error">
                <span *ngIf="loginForm.get('password')?.hasError('required')">Password is required</span>
                <span *ngIf="loginForm.get('password')?.hasError('minlength')">Password must be at least 6 characters</span>
              </span>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-submit"
              [disabled]="isSubmitting || !loginForm.valid"
            >
              <span *ngIf="!isSubmitting">Sign In</span>
              <span *ngIf="isSubmitting">
                <span class="spinner"></span>
                Signing In...
              </span>
            </button>
          </form>

          <!-- Signup Link -->
          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/login/signup">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .auth-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: radial-gradient(135% 135% at 50% 0%, #1a2f4b 0%, #050b14 100%);
        padding: 1rem;
      }

      .auth-container {
        width: 100%;
        max-width: 420px;
      }

      .auth-card {
        background: rgba(11, 18, 33, 0.8);
        border: 1px solid rgba(138, 180, 248, 0.12);
        border-radius: 1rem;
        padding: 2rem;
        backdrop-filter: blur(10px);
      }

      .auth-header {
        margin-bottom: 2rem;
        text-align: center;
      }

      .auth-header h1 {
        margin: 0 0 0.5rem;
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--text);
        letter-spacing: -0.02em;
      }

      .auth-header p {
        margin: 0;
        color: var(--muted);
        font-size: 0.95rem;
      }

      /* Alert */
      .alert {
        padding: 1rem 1.25rem;
        border-radius: 0.85rem;
        border: 1px solid;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideDown 0.3s ease-in;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .alert-danger {
        background: rgba(248, 113, 113, 0.12);
        border-color: rgba(248, 113, 113, 0.3);
        color: #fecaca;
      }

      .icon {
        font-weight: bold;
        font-size: 1.1rem;
      }

      /* Form */
      .auth-form {
        margin-bottom: 1.5rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-label {
        display: block;
        margin-bottom: 0.6rem;
        color: var(--text);
        font-weight: 700;
        font-size: 0.95rem;
      }

      .form-control {
        width: 100%;
        padding: 0.95rem 1rem;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.24);
        border-radius: 0.85rem;
        color: var(--text);
        font-size: 0.95rem;
        transition: all 0.2s ease;
      }

      .form-control:focus {
        outline: none;
        border-color: var(--primary);
        background: rgba(15, 23, 42, 0.9);
        box-shadow: 0 0 0 3px rgba(138, 180, 248, 0.12);
      }

      .form-control::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .form-control.is-invalid {
        border-color: var(--danger);
        background: rgba(248, 113, 113, 0.05);
      }

      .form-control.is-invalid:focus {
        border-color: var(--danger);
        box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.12);
      }

      .form-error {
        display: block;
        color: #fecaca;
        font-size: 0.8rem;
        margin-top: 0.4rem;
      }

      /* Button */
      .btn {
        padding: 0.95rem 1rem;
        border: none;
        border-radius: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .btn-submit {
        background: var(--primary);
        color: #050b14;
        width: 100%;
      }

      .btn-submit:hover:not(:disabled) {
        background: #c7d2fe;
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(138, 180, 248, 0.2);
      }

      .btn-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid rgba(5, 11, 20, 0.3);
        border-top-color: #050b14;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Footer */
      .auth-footer {
        text-align: center;
        border-top: 1px solid rgba(138, 180, 248, 0.12);
        padding-top: 1.5rem;
      }

      .auth-footer p {
        margin: 0;
        color: var(--muted);
        font-size: 0.9rem;
      }

      .auth-footer a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 700;
        transition: color 0.2s ease;
      }

      .auth-footer a:hover {
        color: #bfdbfe;
      }
    `
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // If already logged in, redirect to projects
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/projects']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.loginForm.valid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    this.isSubmitting = true;
    const formData = this.loginForm.value;

    this.authService
      .login({ email: formData.email, password: formData.password })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          // Get return URL from query params or default to /projects
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/projects';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password.';
          } else if (error.status === 400) {
            this.errorMessage = 'Invalid credentials.';
          } else {
            this.errorMessage = 'Failed to sign in. Please try again later.';
          }
        }
      });
  }
}
