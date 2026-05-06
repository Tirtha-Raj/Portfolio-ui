import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService, ContactResponse, PaginationResponse } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="admin-card">
      <p class="eyebrow">Admin</p>
      <h1>Contact Messages</h1>
      <p *ngIf="!auth.isAdmin">You must be logged in as an admin to view messages.</p>

      <div *ngIf="auth.isAdmin">
        <div *ngIf="error" class="message error">{{ error }}</div>
        <div *ngIf="!messages.length && !loading" class="message">No messages available yet.</div>

        <div *ngIf="messages.length" class="message-list">
          <article *ngFor="let message of messages" class="message-card">
            <div class="message-meta">
              <strong>{{ message.name }}</strong>
              <span>{{ message.email }}</span>
            </div>
            <p>{{ message.message }}</p>
            <small>{{ message.createdAt | date:'medium' }}</small>
          </article>
        </div>
      </div>

      <a routerLink="/" class="back-link">← Back to projects</a>
    </section>
  `,
  styles: [
    '.admin-card { max-width: 840px; margin:0 auto; padding:2rem; background:#fff; border-radius:1rem; box-shadow:0 18px 40px rgba(15,23,42,.1); }',
    '.eyebrow { margin:0 0 .4rem; text-transform:uppercase; color:#6366f1; letter-spacing:.2em; font-size:.8rem; }',
    'h1 { margin:.25rem 0 1rem; font-size:2rem; }',
    'p { margin:0 0 1.25rem; color:#475569; }',
    '.message-list { display:grid; gap:1rem; }',
    '.message-card { padding:1.25rem; background:#f8fafc; border-radius:1rem; }',
    '.message-meta { display:flex; justify-content:space-between; gap:1rem; margin-bottom:.75rem; color:#1f2937; }',
    '.message-card p { color:#334155; margin:0 0 .75rem; }',
    '.back-link { color:#4338ca; display:inline-block; margin-top:1rem; text-decoration:none; font-weight:600; }',
    '.message { margin:1rem 0; padding:1rem 1.25rem; border-radius:.75rem; }',
    '.error { background:#fee2e2; color:#991b1b; }'
  ]
})
export class AdminDashboardComponent implements OnInit {
  messages: ContactResponse[] = [];
  loading = false;
  error = '';

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit(): void {
    if (!this.auth.isAdmin) {
      return;
    }

    this.loading = true;
    this.api.getAdminContactMessages(0, 20).subscribe({
      next: (response) => {
        this.messages = response.content;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load admin messages.';
        this.loading = false;
      }
    });
  }
}
