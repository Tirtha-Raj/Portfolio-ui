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
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <p class="eyebrow">Portfolio</p>
        <h1 class="hero-title">Featured Projects</h1>
        <p class="hero-copy">Full-stack development work showcasing modern architecture, clean code, and scalable solutions.</p>
      </div>

      <div class="search-box">
        <input
          type="text"
          placeholder="Search by name, tech stack, or description..."
          [(ngModel)]="searchTerm"
          (keyup.enter)="onSearch()"
          class="search-input"
        />
        <button (click)="onSearch()" class="btn btn-primary">
          Search
        </button>
      </div>
    </section>

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

      .hero-section {
        margin-bottom: 3.5rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(138, 180, 248, 0.12);
      }

      .hero-content {
        margin-bottom: 2rem;
      }

      .eyebrow {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.3em;
        color: var(--primary);
        margin: 0 0 0.5rem;
        font-weight: 700;
      }

      .hero-title {
        margin: 0 0 0.75rem;
        font-size: 3rem;
        font-weight: 800;
        line-height: 1.2;
        color: var(--text);
        letter-spacing: -0.02em;
      }

      .hero-copy {
        margin: 0;
        font-size: 1.1rem;
        color: var(--muted);
        line-height: 1.6;
        max-width: 580px;
      }

      .search-box {
        display: flex;
        gap: 0.75rem;
        max-width: 680px;
      }

      .search-input {
        flex: 1;
        padding: 0.95rem 1.5rem;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.24);
        border-radius: 0.9rem;
        color: var(--text);
        font-size: 1rem;
        transition: all 0.2s ease;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--primary);
        background: rgba(15, 23, 42, 0.9);
      }

      .search-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .btn {
        padding: 0.95rem 2rem;
        border: none;
        border-radius: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.95rem;
      }

      .btn-primary {
        background: var(--primary);
        color: #050b14;
      }

      .btn-primary:hover {
        background: #c7d2fe;
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(138, 180, 248, 0.2);
      }

      .btn-secondary {
        background: rgba(138, 180, 248, 0.12);
        color: var(--primary);
        border: 1px solid rgba(138, 180, 248, 0.3);
      }

      .btn-secondary:hover {
        background: rgba(138, 180, 248, 0.2);
        border-color: var(--primary);
      }

      .btn-like {
        background: rgba(248, 113, 113, 0.1);
        color: var(--danger);
        border: 1px solid rgba(248, 113, 113, 0.3);
      }

      .btn-like.liked {
        background: var(--danger);
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
        background: rgba(138, 180, 248, 0.12);
        color: var(--primary);
        padding: 0.75rem 1.25rem;
      }

      .btn-pagination:hover:not(:disabled) {
        background: rgba(138, 180, 248, 0.2);
      }

      /* Trending Section */
      .trending-section {
        margin-bottom: 3.5rem;
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(138, 180, 248, 0.12);
        border-radius: 1rem;
        padding: 2rem;
      }

      .trending-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.75rem;
        flex-wrap: wrap;
        gap: 1.5rem;
      }

      .section-title {
        font-size: 1.25rem;
        margin: 0;
        font-weight: 700;
        color: var(--text);
      }

      .trending-tabs {
        display: flex;
        gap: 0.75rem;
      }

      .trending-tab {
        padding: 0.65rem 1.25rem;
        background: transparent;
        border: 1px solid rgba(148, 163, 184, 0.24);
        color: var(--muted);
        border-radius: 0.7rem;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
        font-size: 0.9rem;
      }

      .trending-tab:hover {
        border-color: var(--primary);
        color: var(--primary);
      }

      .trending-tab.active {
        background: rgba(138, 180, 248, 0.12);
        border-color: var(--primary);
        color: var(--primary);
      }

      .icon {
        margin-right: 0.3rem;
      }

      .trending-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }

      .trending-card {
        padding: 1.25rem;
        background: rgba(6, 11, 23, 0.5);
        border: 1px solid rgba(138, 180, 248, 0.12);
        border-radius: 0.85rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
      }

      .trending-card:hover {
        border-color: var(--primary);
        background: rgba(6, 11, 23, 0.8);
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(138, 180, 248, 0.08);
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
        border: 1px solid rgba(138, 180, 248, 0.4);
        border-radius: 50%;
        color: var(--primary);
        font-weight: 700;
        font-size: 0.85rem;
      }

      .trending-card h3 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
        line-height: 1.3;
        color: var(--text);
      }

      .tech-stack {
        color: var(--primary);
        font-size: 0.85rem;
        margin: 0.5rem 0 0.75rem;
        font-weight: 500;
      }

      .trending-stats {
        display: flex;
        gap: 1rem;
        color: var(--muted);
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
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1.5rem;
      }

      .result-count {
        color: var(--muted);
        font-size: 0.95rem;
      }

      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 1.75rem;
        margin-bottom: 2rem;
      }

      .project-card {
        background: rgba(11, 18, 33, 0.6);
        border: 1px solid rgba(138, 180, 248, 0.12);
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
        background: linear-gradient(90deg, var(--primary), var(--primary-strong));
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .project-card:hover {
        border-color: var(--primary);
        transform: translateY(-8px);
        box-shadow: 0 20px 50px rgba(138, 180, 248, 0.12);
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
        font-size: 1.3rem;
        line-height: 1.3;
        color: var(--text);
        font-weight: 700;
      }

      .card-badge {
        background: rgba(248, 113, 113, 0.12);
        color: var(--danger);
        padding: 0.4rem 0.8rem;
        border-radius: 0.5rem;
        font-size: 0.85rem;
        font-weight: 700;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .project-meta {
        color: var(--primary);
        font-size: 0.9rem;
        margin: 0.5rem 0;
        font-weight: 500;
      }

      .project-description {
        color: var(--muted);
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 0.75rem 0;
      }

      .project-stats {
        display: flex;
        gap: 1.5rem;
        margin-top: 1.25rem;
        color: var(--muted);
        font-size: 0.9rem;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
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
        padding: 1rem 1.5rem;
        border-radius: 0.85rem;
        margin-bottom: 1.5rem;
        border: 1px solid;
      }

      .alert-danger {
        background: rgba(248, 113, 113, 0.12);
        border-color: rgba(248, 113, 113, 0.3);
        color: #fecaca;
      }

      .alert-info {
        background: rgba(138, 180, 248, 0.12);
        border-color: rgba(138, 180, 248, 0.3);
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
        color: var(--muted);
        font-size: 0.95rem;
      }

      .page-info strong {
        color: var(--primary);
        font-weight: 700;
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
