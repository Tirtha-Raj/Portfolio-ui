import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../../../core/services/auth.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <!-- Header -->
          <div class="auth-header">
            <h1>Create Account</h1>
            <p>Join the community</p>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
            <span class="icon">✕</span>
            {{ errorMessage }}
          </div>

          <!-- Signup Form -->
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
            <!-- Username Field -->
            <div class="form-group">
              <label for="username" class="form-label">Username</label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="form-control"
                placeholder="john_doe"
                [class.is-invalid]="isFieldInvalid('username')"
              />
              <span *ngIf="isFieldInvalid('username')" class="form-error">
                <span *ngIf="signupForm.get('username')?.hasError('required')">Username is required</span>
                <span *ngIf="signupForm.get('username')?.hasError('minlength')">Username must be at least 3 characters</span>
              </span>
            </div>

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
                <span *ngIf="signupForm.get('email')?.hasError('required')">Email is required</span>
                <span *ngIf="signupForm.get('email')?.hasError('email')">Please enter a valid email</span>
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
                placeholder="At least 6 characters"
                [class.is-invalid]="isFieldInvalid('password')"
              />
              <span *ngIf="isFieldInvalid('password')" class="form-error">
                <span *ngIf="signupForm.get('password')?.hasError('required')">Password is required</span>
                <span *ngIf="signupForm.get('password')?.hasError('minlength')">Password must be at least 6 characters</span>
              </span>
            </div>

            <!-- Confirm Password Field -->
            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="form-control"
                placeholder="Confirm your password"
                [class.is-invalid]="isFieldInvalid('confirmPassword')"
              />
              <span *ngIf="isFieldInvalid('confirmPassword')" class="form-error">
                <span *ngIf="signupForm.get('confirmPassword')?.hasError('required')">Please confirm your password</span>
                <span *ngIf="signupForm.hasError('passwordMismatch') && signupForm.get('confirmPassword')?.touched">
                  Passwords do not match
                </span>
              </span>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-submit"
              [disabled]="isSubmitting || !signupForm.valid"
            >
              <span *ngIf="!isSubmitting">Create Account</span>
              <span *ngIf="isSubmitting">
                <span class="spinner"></span>
                Creating...
              </span>
            </button>
          </form>

          <!-- Login Link -->
          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign in</a></p>
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
        border: 1px solid rgba(138, 180, 248, 0.1);
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
        font-weight: 700;
        color: #e2e8f0;
      }

      .auth-header p {
        margin: 0;
        color: #cbd5e1;
        font-size: 0.95rem;
      }

      /* Alert */
      .alert {
        padding: 1rem 1.25rem;
        border-radius: 0.75rem;
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
        background: rgba(248, 113, 113, 0.1);
        border-color: #f87171;
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
        margin-bottom: 1.25rem;
      }

      .form-label {
        display: block;
        margin-bottom: 0.5rem;
        color: #e2e8f0;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .form-control {
        width: 100%;
        padding: 0.85rem 1rem;
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.75rem;
        color: #e2e8f0;
        font-size: 0.95rem;
        transition: all 0.2s ease;
      }

      .form-control:focus {
        outline: none;
        border-color: #8ab4f8;
        background: rgba(15, 23, 42, 0.8);
        box-shadow: 0 0 0 3px rgba(138, 180, 248, 0.1);
      }

      .form-control::placeholder {
        color: #64748b;
      }

      .form-control.is-invalid {
        border-color: #f87171;
        background: rgba(248, 113, 113, 0.05);
      }

      .form-control.is-invalid:focus {
        border-color: #f87171;
        box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
      }

      .form-error {
        display: block;
        color: #fecaca;
        font-size: 0.8rem;
        margin-top: 0.3rem;
      }

      /* Button */
      .btn {
        padding: 0.85rem 1rem;
        border: none;
        border-radius: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.95rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .btn-submit {
        background: #8ab4f8;
        color: #050b14;
        width: 100%;
      }

      .btn-submit:hover:not(:disabled) {
        background: #c7d2fe;
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(138, 180, 248, 0.3);
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
        border-top: 1px solid rgba(138, 180, 248, 0.1);
        padding-top: 1.5rem;
      }

      .auth-footer p {
        margin: 0;
        color: #cbd5e1;
        font-size: 0.9rem;
      }

      .auth-footer a {
        color: #8ab4f8;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s ease;
      }

      .auth-footer a:hover {
        color: #c7d2fe;
      }
    `
  ]
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private analytics: AnalyticsService
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
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.signupForm.valid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    this.isSubmitting = true;
    const formData = this.signupForm.value;

    this.authService
      .signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          // Track signup event
          this.analytics.trackSignup();
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.status === 409) {
            this.errorMessage = 'Email or username already in use.';
          } else if (error.status === 400) {
            this.errorMessage = 'Invalid signup data. Please try again.';
          } else {
            this.errorMessage = 'Failed to create account. Please try again later.';
          }
        }
      });
  }
}
