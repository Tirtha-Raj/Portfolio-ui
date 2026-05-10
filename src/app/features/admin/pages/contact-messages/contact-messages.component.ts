import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContactResponse } from '../../../../core/models/contact.model';
import { ContactApiService } from '../../../../data/api/contact.api';

@Component({
  standalone: true,
  selector: 'app-admin-contact-messages',
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1>Contact Messages</h1>
          <p>Review the latest messages submitted through the portfolio contact form.</p>
        </div>
      </div>

      <section class="panel">
        <div class="panel-header">
          <h2>Messages</h2>
          <span class="status">{{ messages.length }} total</span>
        </div>

        <div *ngIf="loading" class="empty-state">Loading messages...</div>
        <div *ngIf="!loading && !messages.length" class="empty-state">No messages have arrived yet.</div>
        <div *ngIf="error" class="error-message">{{ error }}</div>

        <div *ngIf="messages.length" class="message-grid">
          <article *ngFor="let message of messages" class="message-card">
            <div class="message-title">
              <h3>{{ message.name }}</h3>
              <span>{{ message.createdAt | date: 'medium' }}</span>
            </div>
            <p class="message-email">{{ message.email }}</p>
            <p class="message-body">{{ message.message }}</p>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .admin-page {
        max-width: 1100px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 1.75rem;
      }

      .page-header h1 {
        margin: 0 0 0.5rem;
        font-size: 2rem;
        color: #f8fafc;
      }

      .page-header p {
        margin: 0;
        color: #cbd5e1;
      }

      .panel {
        background: #0f172a;
        border: 1px solid rgba(148, 163, 184, 0.16);
        border-radius: 1rem;
        padding: 1.5rem;
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.25rem;
      }

      .panel-header h2 {
        margin: 0;
        font-size: 1.2rem;
        color: #f8fafc;
      }

      .status {
        color: #94a3b8;
        font-size: 0.95rem;
      }

      .empty-state,
      .error-message {
        padding: 1.25rem;
        border-radius: 0.75rem;
        background: rgba(148, 163, 184, 0.06);
        color: #94a3b8;
        text-align: center;
      }

      .error-message {
        background: rgba(254, 226, 226, 0.2);
        color: #fecaca;
      }

      .message-grid {
        display: grid;
        gap: 1rem;
      }

      .message-card {
        background: #020617;
        border: 1px solid rgba(148, 163, 184, 0.1);
        border-radius: 0.9rem;
        padding: 1.25rem;
      }

      .message-title {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .message-title h3 {
        margin: 0;
        color: #f8fafc;
      }

      .message-title span {
        color: #94a3b8;
        font-size: 0.9rem;
      }

      .message-email {
        margin: 0 0 0.75rem;
        color: #94a3b8;
      }

      .message-body {
        margin: 0;
        color: #cbd5e1;
        line-height: 1.75;
      }
    `
  ]
})
export class AdminContactMessagesComponent implements OnInit {
  messages: ContactResponse[] = [];
  loading = false;
  error = '';

  constructor(private contactApi: ContactApiService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.error = '';

    this.contactApi.getAdminMessages(0, 50).subscribe({
      next: (response) => {
        this.messages = response.content;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load contact messages.';
        this.loading = false;
      }
    });
  }
}

