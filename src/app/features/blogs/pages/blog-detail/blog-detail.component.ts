import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BlogsApiService } from '../../../../data/api/blogs.api';
import { Blog } from '../../../../core/models/blog.model';

@Component({
  standalone: true,
  selector: 'app-blog-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Loading State -->
    <div *ngIf="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading article...</p>
    </div>

    <!-- Error State -->
    <div *ngIf="error && !loading" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Blog Detail -->
    <div *ngIf="blog && !loading" class="blog-detail">
      <!-- Header -->
      <div class="blog-header">
        <p class="eyebrow">Article</p>
        <h1>{{ blog.title }}</h1>

        <div class="blog-meta">
          <span class="meta-item" *ngIf="blog.createdAt">
            <span class="icon">📅</span>
            {{ formatDate(blog.createdAt) }}
          </span>
          <span class="meta-item">
            <span class="icon">👀</span>
            {{ blog.views | number }}
          </span>
          <span class="meta-item">
            <span class="icon">⏱️</span>
            {{ getReadTime(blog.content) }} min
          </span>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Content -->
      <div class="blog-content">
        <div class="content-text" [innerHTML]="formatContent(blog.content)"></div>
      </div>

      <!-- Footer -->
      <div class="blog-footer">
        <a routerLink="/blogs" class="btn btn-back">
          ← Back
        </a>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 5rem 1rem;
      }

      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(138, 180, 248, 0.2);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 1rem;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .loading-state p {
        color: var(--muted);
        font-size: 1rem;
      }

      /* Alert */
      .alert {
        padding: 1.25rem 1.5rem;
        border-radius: 0.85rem;
        border: 1px solid;
        margin-bottom: 1.5rem;
      }

      .alert-danger {
        background: rgba(248, 113, 113, 0.12);
        border-color: rgba(248, 113, 113, 0.3);
        color: #fecaca;
      }

      /* Blog Detail */
      .blog-detail {
        animation: fadeIn 0.3s ease-in;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .blog-header {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(138, 180, 248, 0.12);
      }

      .eyebrow {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.3em;
        color: var(--primary);
        margin: 0 0 0.5rem;
        font-weight: 700;
      }

      h1 {
        margin: 0 0 1.5rem;
        font-size: 3rem;
        font-weight: 800;
        line-height: 1.2;
        color: var(--text);
        letter-spacing: -0.02em;
      }

      .blog-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        align-items: center;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--muted);
        font-size: 0.95rem;
        font-weight: 600;
      }

      .icon {
        font-size: 1rem;
      }

      /* Divider */
      .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(138, 180, 248, 0.12), transparent);
        margin: 0;
      }

      /* Content */
      .blog-content {
        margin: 3rem 0;
      }

      .content-text {
        color: var(--muted);
        font-size: 1.05rem;
        line-height: 1.8;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      .content-text p {
        margin: 1.75rem 0;
      }

      .content-text h2 {
        color: var(--text);
        font-size: 1.75rem;
        font-weight: 700;
        margin: 2.5rem 0 1rem;
        letter-spacing: -0.01em;
      }

      .content-text h3 {
        color: var(--text);
        font-size: 1.3rem;
        font-weight: 700;
        margin: 1.75rem 0 0.75rem;
      }

      .content-text ul,
      .content-text ol {
        margin: 1.75rem 0;
        padding-left: 2rem;
      }

      .content-text li {
        margin-bottom: 0.75rem;
      }

      .content-text code {
        background: rgba(138, 180, 248, 0.12);
        color: var(--primary);
        padding: 0.25rem 0.6rem;
        border-radius: 0.35rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        font-weight: 600;
      }

      .content-text blockquote {
        border-left: 4px solid var(--primary);
        padding-left: 1.75rem;
        margin: 2rem 0;
        color: var(--muted);
        font-style: italic;
        opacity: 0.9;
      }

      /* Footer */
      .blog-footer {
        padding-top: 2rem;
        margin-top: 2rem;
        border-top: 1px solid rgba(138, 180, 248, 0.12);
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.85rem 1.5rem;
        border: 1px solid rgba(138, 180, 248, 0.24);
        background: rgba(138, 180, 248, 0.12);
        color: var(--primary);
        border-radius: 0.9rem;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-back:hover {
        background: rgba(138, 180, 248, 0.2);
        transform: translateY(-2px);
      }

      /* Responsive */
      @media (max-width: 768px) {
        h1 {
          font-size: 2rem;
        }

        .content-text {
          font-size: 1rem;
          line-height: 1.7;
        }

        .blog-meta {
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .content-text h2 {
          font-size: 1.5rem;
        }

        .content-text h3 {
          font-size: 1.1rem;
        }
      }
    `
  ]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private blogsApi: BlogsApiService) {}

  ngOnInit(): void {
    this.loadBlog();
  }

  private loadBlog(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid blog ID.';
      return;
    }

    this.loading = true;
    this.blogsApi.getById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;

        // Record view asynchronously
        this.blogsApi.recordView(id).subscribe({
          next: (updated) => {
            if (this.blog) {
              this.blog.views = updated.views;
            }
          },
          error: () => {
            // Silently fail - view tracking is not critical
          }
        });
      },
      error: () => {
        this.error = 'Unable to load the blog post. Please try again later.';
        this.loading = false;
      }
    });
  }

  getReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatContent(content: string): string {
    // Replace newlines with paragraph tags
    return content
      .split('\n\n')
      .map((para) => `<p>${this.escapeHtml(para)}</p>`)
      .join('');
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
