import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="auth-card">
      <h1>{{ mode === 'login' ? 'Login' : 'Create an account' }}</h1>
      <p>{{ mode === 'login' ? 'Sign in to manage likes and admin features.' : 'Create a new user account.' }}</p>

      <form (ngSubmit)="submit()">
        <label *ngIf="mode === 'signup'">
          Username
          <input type="text" [(ngModel)]="username" name="username" required />
        </label>

        <label>
          Email
          <input type="email" [(ngModel)]="email" name="email" required />
        </label>

        <label>
          Password
          <input type="password" [(ngModel)]="password" name="password" required />
        </label>

        <button type="submit">{{ mode === 'login' ? 'Login' : 'Sign up' }}</button>
      </form>

      <p class="toggle">
        {{ mode === 'login' ? 'No account yet?' : 'Already have an account?' }}
        <button class="text-button" (click)="toggleMode()">
          {{ mode === 'login' ? 'Create one' : 'Login instead' }}
        </button>
      </p>

      <p *ngIf="error" class="message error">{{ error }}</p>
    </section>
  `,
  styles: [
    '.auth-card { max-width: 420px; margin:0 auto; padding:2rem; background:#fff; border-radius:1rem; box-shadow:0 18px 40px rgba(15,23,42,.1); }',
    'h1 { margin:0 0 .5rem; font-size:2rem; }',
    'p { margin:.5rem 0 1rem; color:#475569; }',
    'label { display:block; margin-bottom:1rem; color:#334155; font-weight:600; }',
    'input { width:100%; padding:.85rem 1rem; border:1px solid #cbd5e1; border-radius:.85rem; margin-top:.4rem; }',
    'button[type="submit"] { width:100%; padding:.95rem 1rem; border:none; border-radius:.85rem; background:#4338ca; color:#fff; margin-top:1rem; cursor:pointer; }',
    '.toggle { margin-top:1rem; color:#475569; }',
    '.text-button { border:none; background:none; color:#4338ca; cursor:pointer; font-weight:700; margin-left:.35rem; }',
    '.message { margin-top:1rem; padding:1rem; background:#f8fafc; border-radius:.75rem; }',
    '.error { background:#fee2e2; color:#991b1b; }'
  ]
})
export class LoginComponent {
  mode: 'login' | 'signup' = 'login';
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  toggleMode(): void {
    this.mode = this.mode === 'login' ? 'signup' : 'login';
    this.error = '';
  }

  submit(): void {
    this.error = '';
    if (this.mode === 'login') {
      this.auth.login({ email: this.email, password: this.password }).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => (this.error = 'Login failed. Please check your credentials.')
      });
    } else {
      this.auth.signup({ username: this.username, email: this.email, password: this.password }).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => (this.error = 'Signup failed. Please try again.')
      });
    }
  }
}
