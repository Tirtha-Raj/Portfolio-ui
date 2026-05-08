import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BlogsApiService } from '../../../../data/api/blogs.api';
import { Blog } from '../../../../core/models/blog.model';
import { PaginationResponse } from '../../../../core/models/pagination.model';

@Component({
  standalone: true,
  selector: 'app-blog-list',
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Header -->
    <div class="blog-header">
      <div class="header-content">
        <p class="eyebrow">Blog</p>
        <h1>Latest Stories</h1>
        <p class="subtitle">Developer notes, project updates, and technical insights</p>
      </div>
    </div>

    <!-- Error Message -->
    <div *ngIf="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Blog Grid -->
    <div class="blog-section">
      <div class="section-header">
        <h2 class="section-title">Articles</h2>
        <span class="result-count" *ngIf="pagination">
          {{ pagination.totalElements }} article{{ pagination.totalElements !== 1 ? 's' : '' }}
        </span>
      </div>

      <div *ngIf="!loading && blogs.length === 0" class="alert alert-info">
        No blog posts found yet. Check back soon for new content.
      </div>

      <div class="blog-list">
        <article *ngFor="let blog of blogs" class="blog-item" [routerLink]="['/blogs', blog.id]">
          <div class="blog-content">
            <h3 class="blog-title">{{ blog.title }}</h3>
            
            <p class="blog-excerpt">
              {{ blog.content | slice: 0: 200 }}{{ blog.content.length > 200 ? '...' : '' }}
            </p>

            <div class="blog-footer">
              <span class="read-time">{{ getReadTime(blog.content) }} min read</span>
              <span class="view-count">
                <span class="icon">👀</span>
                {{ blog.views | number }}
              </span>
            </div>
          </div>

          <div class="blog-date" *ngIf="blog.createdAt">
            {{ formatDate(blog.createdAt) }}
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div *ngIf="pagination && pagination.totalPages > 1" class="pagination-controls">
        <button
          (click)="previousPage()"
          [disabled]="pagination.isFirst"
          class="btn btn-pagination"
        >
          ← Previous
        </button>

        <div class="page-info">
          Page <strong>{{ pagination.pageNumber + 1 }}</strong> of
          <strong>{{ pagination.totalPages }}</strong>
        </div>

        <button
          (click)="nextPage()"
          [disabled]="pagination.isLast"
          class="btn btn-pagination"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading blog posts...</p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .blog-header {
        margin-bottom: 3rem;
      }

      .header-content {
        margin-bottom: 1rem;
      }

      .eyebrow {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.3em;
        color: #8ab4f8;
        margin: 0 0 0.5rem;
        font-weight: 600;
      }

      h1,
      h2,
      h3 {
        color: #e2e8f0;
      }

      h1 {
        margin: 0 0 0.75rem;
        font-size: 2.5rem;
        font-weight: 700;
      }

      .subtitle {
        color: #cbd5e1;
        font-size: 1.1rem;
        margin: 0;
      }

      /* Alert Messages */
      .alert {
        padding: 1rem 1.25rem;
        border-radius: 0.75rem;
        margin-bottom: 1.5rem;
        border: 1px solid;
      }

      .alert-danger {
        background: rgba(248, 113, 113, 0.1);
        border-color: #f87171;
        color: #fecaca;
      }

      .alert-info {
        background: rgba(138, 180, 248, 0.1);
        border-color: #8ab4f8;
        color: #bfdbfe;
      }

      /* Blog Section */
      .blog-section {
        margin-top: 2rem;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .section-title {
        font-size: 1.5rem;
        margin: 0;
      }

      .result-count {
        color: #94a3b8;
        font-size: 0.95rem;
      }

      /* Blog List */
      .blog-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .blog-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1.5rem;
        padding: 1.75rem;
        background: rgba(11, 18, 33, 0.8);
        border: 1px solid rgba(138, 180, 248, 0.1);
        border-radius: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .blog-item:hover {
        border-color: #8ab4f8;
        background: rgba(11, 18, 33, 0.95);
        transform: translateX(4px);
        box-shadow: 0 12px 30px rgba(138, 180, 248, 0.08);
      }

      .blog-content {
        flex: 1;
        min-width: 0;
      }

      .blog-title {
        margin: 0 0 0.75rem;
        font-size: 1.25rem;
        line-height: 1.4;
        color: #e2e8f0;
      }

      .blog-excerpt {
        color: #cbd5e1;
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 0 0 1rem;
      }

      .blog-footer {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        color: #94a3b8;
        font-size: 0.85rem;
      }

      .read-time {
        display: flex;
        align-items: center;
      }

      .view-count {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      .icon {
        font-size: 0.9rem;
      }

      .blog-date {
        flex-shrink: 0;
        color: #8ab4f8;
        font-size: 0.85rem;
        font-weight: 500;
        background: rgba(138, 180, 248, 0.1);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        white-space: nowrap;
      }

      /* Pagination */
      .pagination-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        margin-top: 2rem;
        flex-wrap: wrap;
      }

      .btn {
        padding: 0.75rem 1.25rem;
        border: none;
        border-radius: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.95rem;
      }

      .btn-pagination {
        background: rgba(138, 180, 248, 0.1);
        color: #8ab4f8;
        border: 1px solid #8ab4f8;
      }

      .btn-pagination:hover:not(:disabled) {
        background: rgba(138, 180, 248, 0.2);
        transform: translateY(-2px);
      }

      .btn-pagination:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .page-info {
        color: #94a3b8;
        font-size: 0.95rem;
      }

      .page-info strong {
        color: #8ab4f8;
        font-weight: 600;
      }

      /* Loading State */
      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 1rem;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(138, 180, 248, 0.2);
        border-top-color: #8ab4f8;
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
        color: #94a3b8;
      }

      /* Responsive */
      @media (max-width: 768px) {
        h1 {
          font-size: 1.75rem;
        }

        .blog-item {
          flex-direction: column;
          gap: 1rem;
        }

        .blog-date {
          width: 100%;
          text-align: center;
        }

        .blog-footer {
          width: 100%;
        }
      }
    `
  ]
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  error = '';
  currentPage = 0;
  pageSize = 10;
  pagination: PaginationResponse<Blog> | null = null;

  constructor(private blogsApi: BlogsApiService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = '';

    this.blogsApi.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.blogs = response.content;
        this.pagination = response;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load blog posts. Please try again later.';
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.pagination && this.pagination.hasNext) {
      this.currentPage++;
      this.loadBlogs();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.pagination && this.pagination.hasPrevious) {
      this.currentPage--;
      this.loadBlogs();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      month: 'short',
      day: 'numeric'
    });
  }
}
