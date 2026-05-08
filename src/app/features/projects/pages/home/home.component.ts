import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProjectsApiService } from '../../../../data/api/projects.api';
import { Project } from '../../../../core/models/project.model';
import { PaginationResponse } from '../../../../core/models/pagination.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-projects-home',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Search Header -->
    <div class="projects-header">
      <div class="header-content">
        <p class="eyebrow">Portfolio</p>
        <h1>Featured Projects</h1>
        <p class="subtitle">Explore latest projects and discover what's trending</p>
      </div>

      <div class="search-box">
        <input
          type="text"
          placeholder="Search projects..."
          [(ngModel)]="searchTerm"
          (keyup.enter)="onSearch()"
          class="search-input"
        />
        <button (click)="onSearch()" class="btn btn-primary">
          <span>Search</span>
        </button>
      </div>
    </div>

    <!-- Trending Section -->
    <div class="trending-section" *ngIf="!searchTerm">
      <div class="trending-controls">
        <h2 class="section-title">Trending Now</h2>
        <div class="trending-tabs">
          <button
            [class.active]="trendingType === 'views'"
            (click)="loadTrending('views')"
            class="trending-tab"
          >
            <span class="icon">👀</span> Most Viewed
          </button>
          <button
            [class.active]="trendingType === 'likes'"
            (click)="loadTrending('likes')"
            class="trending-tab"
          >
            <span class="icon">❤️</span> Most Liked
          </button>
        </div>
      </div>

      <div class="trending-grid">
        <div *ngFor="let project of trendingProjects" class="trending-card" [routerLink]="['/projects', project.id]">
          <div class="trending-rank">
            <span class="rank-badge">{{ getProjectRank(project) }}</span>
          </div>
          <h3>{{ project.title }}</h3>
          <p class="tech-stack">{{ project.techStack }}</p>
          <div class="trending-stats">
            <span class="stat">
              <span class="stat-icon">👀</span>
              {{ project.viewsCount | number }}
            </span>
            <span class="stat">
              <span class="stat-icon">❤️</span>
              {{ project.likesCount | number }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div *ngIf="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Projects Grid -->
    <div class="projects-section">
      <div class="section-header">
        <h2 class="section-title">
          {{ searchTerm ? 'Search Results' : 'All Projects' }}
        </h2>
        <span class="result-count" *ngIf="pagination">
          {{ pagination.totalElements }} project{{ pagination.totalElements !== 1 ? 's' : '' }}
        </span>
      </div>

      <div *ngIf="!loading && projects.length === 0" class="alert alert-info">
        No projects found. Try adjusting your search.
      </div>

      <div class="projects-grid">
        <article *ngFor="let project of projects" class="project-card">
          <div class="card-content">
            <div class="card-header">
              <h3 class="project-title">{{ project.title }}</h3>
              <div class="card-badge">{{ project.likesCount }}</div>
            </div>

            <p class="project-meta">{{ project.techStack }}</p>
            <p class="project-description">{{ project.description | slice: 0:120 }}...</p>

            <div class="project-stats">
              <span class="stat-item">
                <span class="icon">👀</span>
                {{ project.viewsCount }}
              </span>
              <span class="stat-item">
                <span class="icon">❤️</span>
                {{ project.likesCount }}
              </span>
            </div>
          </div>

          <div class="card-actions">
            <a [routerLink]="['/projects', project.id]" class="btn btn-secondary">
              View Details
            </a>
            <button
              (click)="toggleLike(project, $event)"
              [class.liked]="project.userHasLiked"
              class="btn btn-like"
              [disabled]="!auth.isLoggedIn"
            >
              {{ project.userHasLiked ? 'Unlike' : 'Like' }}
            </button>
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
      <p>Loading projects...</p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .projects-header {
        margin-bottom: 3rem;
      }

      .header-content {
        margin-bottom: 2rem;
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

      .search-box {
        display: flex;
        gap: 0.75rem;
        max-width: 500px;
      }

      .search-input {
        flex: 1;
        padding: 0.875rem 1.25rem;
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.75rem;
        color: #e2e8f0;
        font-size: 1rem;
        transition: all 0.2s ease;
      }

      .search-input:focus {
        outline: none;
        border-color: #8ab4f8;
        background: rgba(15, 23, 42, 0.8);
      }

      .search-input::placeholder {
        color: #64748b;
      }

      .btn {
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.95rem;
      }

      .btn-primary {
        background: #8ab4f8;
        color: #050b14;
      }

      .btn-primary:hover {
        background: #c7d2fe;
        transform: translateY(-2px);
      }

      .btn-secondary {
        background: rgba(138, 180, 248, 0.1);
        color: #8ab4f8;
        border: 1px solid #8ab4f8;
      }

      .btn-secondary:hover {
        background: rgba(138, 180, 248, 0.2);
      }

      .btn-like {
        background: rgba(248, 113, 113, 0.1);
        color: #f87171;
        border: 1px solid #f87171;
      }

      .btn-like.liked {
        background: #f87171;
        color: #fff;
      }

      .btn-like:hover:not(:disabled) {
        background: rgba(248, 113, 113, 0.2);
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-pagination {
        background: rgba(138, 180, 248, 0.1);
        color: #8ab4f8;
        padding: 0.75rem 1.25rem;
      }

      .btn-pagination:hover:not(:disabled) {
        background: rgba(138, 180, 248, 0.2);
      }

      /* Trending Section */
      .trending-section {
        margin-bottom: 3rem;
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(148, 163, 184, 0.1);
        border-radius: 1rem;
        padding: 2rem;
      }

      .trending-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .section-title {
        font-size: 1.5rem;
        margin: 0;
      }

      .trending-tabs {
        display: flex;
        gap: 0.75rem;
      }

      .trending-tab {
        padding: 0.65rem 1.25rem;
        background: transparent;
        border: 1px solid rgba(148, 163, 184, 0.2);
        color: #cbd5e1;
        border-radius: 0.6rem;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
      }

      .trending-tab:hover {
        border-color: #8ab4f8;
        color: #8ab4f8;
      }

      .trending-tab.active {
        background: #8ab4f8;
        border-color: #8ab4f8;
        color: #050b14;
      }

      .icon {
        margin-right: 0.35rem;
      }

      .trending-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }

      .trending-card {
        padding: 1.25rem;
        background: rgba(6, 11, 23, 0.6);
        border: 1px solid rgba(138, 180, 248, 0.1);
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      }

      .trending-card:hover {
        border-color: #8ab4f8;
        background: rgba(6, 11, 23, 0.9);
        transform: translateY(-4px);
      }

      .trending-rank {
        position: absolute;
        top: 1rem;
        right: 1rem;
      }

      .rank-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: rgba(138, 180, 248, 0.2);
        border: 1px solid #8ab4f8;
        border-radius: 50%;
        color: #8ab4f8;
        font-weight: 700;
        font-size: 0.85rem;
      }

      .trending-card h3 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
        line-height: 1.3;
      }

      .tech-stack {
        color: #8ab4f8;
        font-size: 0.85rem;
        margin: 0.5rem 0 0.75rem;
      }

      .trending-stats {
        display: flex;
        gap: 1rem;
        color: #94a3b8;
        font-size: 0.9rem;
      }

      .stat {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      .stat-icon {
        font-size: 0.95rem;
      }

      /* Projects Section */
      .projects-section {
        margin-top: 2rem;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .result-count {
        color: #94a3b8;
        font-size: 0.95rem;
      }

      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .project-card {
        background: rgba(11, 18, 33, 0.8);
        border: 1px solid rgba(138, 180, 248, 0.1);
        border-radius: 1rem;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
        overflow: hidden;
        position: relative;
      }

      .project-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #8ab4f8, #6366f1);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .project-card:hover {
        border-color: #8ab4f8;
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(138, 180, 248, 0.1);
      }

      .project-card:hover::before {
        opacity: 1;
      }

      .card-content {
        flex: 1;
        margin-bottom: 1.25rem;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }

      .project-title {
        margin: 0;
        font-size: 1.25rem;
        line-height: 1.3;
        color: #e2e8f0;
      }

      .card-badge {
        background: rgba(248, 113, 113, 0.1);
        color: #f87171;
        padding: 0.35rem 0.75rem;
        border-radius: 0.5rem;
        font-size: 0.85rem;
        font-weight: 700;
        white-space: nowrap;
      }

      .project-meta {
        color: #8ab4f8;
        font-size: 0.9rem;
        margin: 0.5rem 0;
        font-weight: 500;
      }

      .project-description {
        color: #cbd5e1;
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 0.75rem 0;
      }

      .project-stats {
        display: flex;
        gap: 1.5rem;
        margin-top: 1rem;
        color: #94a3b8;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.9rem;
      }

      .card-actions {
        display: flex;
        gap: 0.75rem;
      }

      .card-actions .btn {
        flex: 1;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
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

      /* Pagination */
      .pagination-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        margin-top: 2rem;
        flex-wrap: wrap;
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

        .search-box {
          flex-direction: column;
          width: 100%;
        }

        .search-input {
          width: 100%;
        }

        .trending-grid {
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }

        .projects-grid {
          grid-template-columns: 1fr;
        }

        .section-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `
  ]
})
export class HomeComponent implements OnInit {
  projects: Project[] = [];
  trendingProjects: Project[] = [];
  searchTerm = '';
  loading = false;
  error = '';
  currentPage = 0;
  pageSize = 12;
  pagination: PaginationResponse<Project> | null = null;
  trendingType: 'views' | 'likes' = 'views';

  constructor(public auth: AuthService, private projectsApi: ProjectsApiService) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadTrending('views');
  }

  loadProjects(): void {
    this.loading = true;
    this.error = '';
    const request = this.searchTerm?.trim()
      ? this.projectsApi.search(this.searchTerm.trim(), this.currentPage, this.pageSize)
      : this.projectsApi.getAll(this.currentPage, this.pageSize);

    request.subscribe({
      next: (response) => {
        this.projects = response.content;
        this.pagination = response;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load projects. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadTrending(type: 'views' | 'likes'): void {
    this.trendingType = type;
    const request =
      type === 'views' ? this.projectsApi.getTrendingViews(0, 6) : this.projectsApi.getTrendingLikes(0, 6);

    request.subscribe({
      next: (response) => {
        this.trendingProjects = response.content;
      },
      error: () => {
        this.error = 'Unable to load trending projects.';
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadProjects();
  }

  nextPage(): void {
    if (this.pagination && this.pagination.hasNext) {
      this.currentPage++;
      this.loadProjects();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.pagination && this.pagination.hasPrevious) {
      this.currentPage--;
      this.loadProjects();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleLike(project: Project, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.auth.isLoggedIn) {
      this.error = 'Please log in to like projects.';
      return;
    }

    const request = project.userHasLiked
      ? this.projectsApi.unlike(project.id)
      : this.projectsApi.like(project.id);

    request.subscribe({
      next: (updated) => {
        const index = this.projects.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          this.projects[index] = updated;
        }
        const trendingIndex = this.trendingProjects.findIndex((p) => p.id === updated.id);
        if (trendingIndex !== -1) {
          this.trendingProjects[trendingIndex] = updated;
        }
      },
      error: () => {
        this.error = 'Unable to update like status. Please try again.';
      }
    });
  }

  getProjectRank(project: Project): string {
    const index = this.trendingProjects.indexOf(project);
    if (index === -1) return '#?';
    return `#${index + 1}`;
  }
}
