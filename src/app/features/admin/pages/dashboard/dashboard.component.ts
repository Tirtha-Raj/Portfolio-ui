import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContactApiService } from '../../../../data/api/contact.api';
import { ContactResponse } from '../../../../core/models/contact.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ProjectsApiService } from '../../../../data/api/projects.api';
import { BlogsApiService } from '../../../../data/api/blogs.api';
import { Project } from '../../../../core/models/project.model';
import { Blog } from '../../../../core/models/blog.model';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      <!-- Project Management Summary -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📁</div>
          <div class="stat-content">
            <h3>{{ totalProjects | number }}</h3>
            <p>Projects Managed</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <h3>{{ totalBlogs | number }}</h3>
            <p>Published Blog Posts</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-content">
            <h3>{{ totalMessages | number }}</h3>
            <p>Contact Messages</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✨</div>
          <div class="stat-content">
            <h3>{{ latestProjects.length + latestBlogs.length }}</h3>
            <p>Latest Updates</p>
          </div>
        </div>
      </div>

      <!-- Latest Projects and Blogs -->
      <div class="summary-panels">
        <section class="panel">
          <div class="section-header">
            <h2>Latest Projects</h2>
            <a routerLink="/admin/projects" class="view-all">View All</a>
          </div>
          <div *ngIf="latestProjects.length" class="item-list">
            <div *ngFor="let project of latestProjects" class="item-card">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description | slice:0:100 }}{{ project.description.length > 100 ? '...' : '' }}</p>
              <div class="item-meta">
                <span>Views: {{ project.viewsCount | number }}</span>
                <span>Likes: {{ project.likesCount | number }}</span>
              </div>
            </div>
          </div>
          <div *ngIf="!latestProjects.length" class="empty-state">
            No recent projects available.
          </div>
        </section>

        <section class="panel">
          <div class="section-header">
            <h2>Latest Blogs</h2>
            <a routerLink="/admin/blogs" class="view-all">View All</a>
          </div>
          <div *ngIf="latestBlogs.length" class="item-list">
            <div *ngFor="let blog of latestBlogs" class="item-card">
              <h3>{{ blog.title }}</h3>
              <p>{{ blog.content | slice:0:100 }}{{ blog.content.length > 100 ? '...' : '' }}</p>
              <div class="item-meta">
                <span>Views: {{ blog.views | number }}</span>
              </div>
            </div>
          </div>
          <div *ngIf="!latestBlogs.length" class="empty-state">
            No recent blogs available.
          </div>
        </section>
      </div>

      <!-- Recent Contact Messages -->
      <div class="recent-messages">
        <div class="section-header">
          <h2>Recent Contact Messages</h2>
          <a routerLink="/admin/contact-messages" class="view-all">View All</a>
        </div>

        <div *ngIf="loadingMessages" class="loading">Loading messages...</div>

        <div *ngIf="messagesError" class="error-message">{{ messagesError }}</div>

        <div *ngIf="!messages.length && !loadingMessages" class="empty-state">
          No messages available yet.
        </div>

        <div *ngIf="messages.length" class="messages-list">
          <div *ngFor="let message of messages.slice(0, 5)" class="message-item">
            <div class="message-header">
              <strong>{{ message.name }}</strong>
              <span class="email">{{ message.email }}</span>
              <span class="date">{{ message.createdAt | date:'short' }}</span>
            </div>
            <p class="message-content">{{ message.message | slice:0:100 }}...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        max-width: 1200px;
        margin: 0 auto;
      }

      .dashboard-header {
        margin-bottom: 2rem;
      }

      .dashboard-header h1 {
        margin: 0 0 0.5rem;
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
      }

      .dashboard-header p {
        margin: 0;
        color: #64748b;
        font-size: 1rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      .stat-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s ease;
      }

      .stat-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .stat-icon {
        font-size: 2rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        border-radius: 0.75rem;
      }

      .stat-content h3 {
        margin: 0 0 0.25rem;
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
      }

      .stat-content p {
        margin: 0;
        color: #64748b;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .recent-messages {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .section-header h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
      }

      .view-all {
        color: #8ab4f8;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: color 0.2s ease;
      }

      .view-all:hover {
        color: #7c3aed;
      }

      .loading {
        text-align: center;
        color: #64748b;
        padding: 2rem;
      }

      .error-message {
        background: #fee2e2;
        color: #dc2626;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
      }

      .empty-state {
        text-align: center;
        color: #64748b;
        padding: 2rem;
        font-style: italic;
      }

      .messages-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .message-item {
        padding: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        background: #f8fafc;
      }

      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .message-header strong {
        color: #1e293b;
        font-weight: 600;
      }

      .summary-panels {
        display: grid;
        gap: 1.5rem;
        margin: 2rem 0;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }

      .panel {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      .item-list {
        display: grid;
        gap: 1rem;
      }

      .item-card {
        padding: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.65rem;
        background: #f8fafc;
      }

      .item-card h3 {
        margin: 0 0 0.5rem;
        font-size: 1.05rem;
        color: #0f172a;
      }

      .item-card p {
        margin: 0 0 0.75rem;
        color: #475569;
        line-height: 1.5;
      }

      .item-meta {
        display: flex;
        gap: 1rem;
        color: #64748b;
        font-size: 0.9rem;
        flex-wrap: wrap;
      }

      .email {
        color: #64748b;
        font-size: 0.9rem;
      }

      .date {
        color: #94a3b8;
        font-size: 0.8rem;
      }

      .message-content {
        margin: 0;
        color: #475569;
        line-height: 1.5;
      }

      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .stat-card {
          padding: 1rem;
        }

        .section-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
      }
    `
  ]
})
export class AdminDashboardComponent implements OnInit {
  totalProjects = 0;
  totalBlogs = 0;
  totalMessages = 0;
  latestProjects: Project[] = [];
  latestBlogs: Blog[] = [];
  messages: ContactResponse[] = [];
  loadingMessages = false;
  messagesError = '';

  constructor(
    private projectsApi: ProjectsApiService,
    private blogsApi: BlogsApiService,
    private contactApi: ContactApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAdmin) {
      return;
    }

    this.loadProjectSummary();
    this.loadBlogSummary();
    this.loadRecentMessages();
  }

  private loadProjectSummary(): void {
    this.projectsApi.getTrendingViews(0, 5).subscribe({
      next: (response) => {
        this.totalProjects = response.totalElements;
        this.latestProjects = response.content;
      },
      error: () => {
        this.totalProjects = 0;
        this.latestProjects = [];
      }
    });
  }

  private loadBlogSummary(): void {
    this.blogsApi.getAll(0, 5).subscribe({
      next: (response) => {
        this.totalBlogs = response.totalElements;
        this.latestBlogs = response.content;
      },
      error: () => {
        this.totalBlogs = 0;
        this.latestBlogs = [];
      }
    });
  }

  private loadRecentMessages(): void {
    this.loadingMessages = true;
    this.contactApi.getAdminMessages(0, 5).subscribe({
      next: (response) => {
        this.messages = response.content;
        this.totalMessages = response.totalElements;
        this.loadingMessages = false;
      },
      error: (error) => {
        this.messagesError = 'Failed to load recent messages.';
        this.loadingMessages = false;
      }
    });
  }
}
