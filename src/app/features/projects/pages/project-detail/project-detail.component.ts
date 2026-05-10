import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProjectsApiService } from '../../../../data/api/projects.api';
import { Project } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Loading State -->
    <div *ngIf="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading project...</p>
    </div>

    <!-- Error State -->
    <div *ngIf="error && !loading" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Project Detail -->
    <div *ngIf="project && !loading" class="project-detail">
      <!-- Header Section -->
      <div class="detail-header">
        <div class="header-content">
          <p class="eyebrow">Project</p>
          <h1>{{ project.title }}</h1>
          <p class="subtitle">{{ project.description }}</p>

          <div class="project-meta">
            <span class="meta-badge">{{ project.techStack }}</span>
            <span class="meta-item">
              <span class="icon">👀</span>
              {{ project.viewsCount | number }}
            </span>
            <span class="meta-item">
              <span class="icon">❤️</span>
              {{ project.likesCount | number }}
            </span>
          </div>
        </div>

        <div class="header-actions">
          <button (click)="toggleLike()" [class.liked]="project.userHasLiked" class="btn btn-like">
            <span class="icon">❤️</span>
            {{ project.userHasLiked ? 'Unlike' : 'Like' }}
          </button>
          <a
            *ngIf="project.liveUrl"
            [href]="project.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-external"
          >
            <span class="icon">↗</span> Live Demo
          </a>
          <a
            *ngIf="project.githubUrl"
            [href]="project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-external"
          >
            <span class="icon">→</span> Source
          </a>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Details Section -->
      <div class="details-section">
        <div class="detail-box">
          <h3>Overview</h3>
          <p>{{ project.description }}</p>
        </div>

        <div class="detail-box">
          <h3>Tech Stack</h3>
          <div class="tech-tags">
            <span *ngFor="let tech of getTechs()" class="tech-tag">
              {{ tech }}
            </span>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="action-footer">
        <a routerLink="/projects" class="btn btn-back">
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

      /* Project Detail */
      .project-detail {
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

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
        margin-bottom: 2.5rem;
        flex-wrap: wrap;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(138, 180, 248, 0.12);
      }

      .header-content {
        flex: 1;
        min-width: 0;
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
        margin: 0 0 0.75rem;
        font-size: 3rem;
        font-weight: 800;
        line-height: 1.2;
        color: var(--text);
        letter-spacing: -0.02em;
      }

      h3 {
        color: var(--text);
      }

      .subtitle {
        font-size: 1.1rem;
        color: var(--muted);
        margin: 0 0 1.5rem;
        line-height: 1.6;
      }

      .project-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        align-items: center;
      }

      .meta-badge {
        background: rgba(138, 180, 248, 0.12);
        color: var(--primary);
        padding: 0.5rem 1.2rem;
        border-radius: 0.6rem;
        font-weight: 600;
        font-size: 0.9rem;
        border: 1px solid rgba(138, 180, 248, 0.24);
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: var(--muted);
        font-size: 0.95rem;
        font-weight: 600;
      }

      .icon {
        font-size: 1.1rem;
      }

      .header-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
      }

      .btn {
        padding: 0.85rem 1.25rem;
        border: none;
        border-radius: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.95rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        white-space: nowrap;
      }

      .btn-like {
        background: rgba(248, 113, 113, 0.12);
        color: var(--danger);
        border: 1px solid rgba(248, 113, 113, 0.24);
      }

      .btn-like.liked {
        background: var(--danger);
        color: #fff;
      }

      .btn-like:hover {
        background: rgba(248, 113, 113, 0.2);
        transform: translateY(-2px);
      }

      .btn-external {
        background: rgba(138, 180, 248, 0.12);
        color: var(--primary);
        border: 1px solid rgba(138, 180, 248, 0.24);
      }

      .btn-external:hover {
        background: rgba(138, 180, 248, 0.2);
        transform: translateY(-2px);
      }

      .btn-back {
        background: rgba(138, 180, 248, 0.12);
        color: var(--primary);
        border: 1px solid rgba(138, 180, 248, 0.24);
      }

      .btn-back:hover {
        background: rgba(138, 180, 248, 0.2);
        transform: translateY(-2px);
      }

      /* Divider */
      .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(138, 180, 248, 0.12), transparent);
        margin: 0;
      }

      /* Details Section */
      .details-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
        margin: 3rem 0;
      }

      .detail-box {
        background: rgba(11, 18, 33, 0.6);
        border: 1px solid rgba(138, 180, 248, 0.12);
        border-radius: 1rem;
        padding: 2rem;
        transition: all 0.3s ease;
      }

      .detail-box:hover {
        border-color: var(--primary);
        background: rgba(11, 18, 33, 0.8);
      }

      .detail-box h3 {
        margin: 0 0 1.25rem;
        font-size: 1.3rem;
        font-weight: 700;
      }

      .detail-box p {
        color: var(--muted);
        line-height: 1.8;
        margin: 0;
      }

      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .tech-tag {
        display: inline-block;
        background: rgba(138, 180, 248, 0.12);
        color: var(--primary);
        padding: 0.6rem 1.2rem;
        border-radius: 0.7rem;
        font-size: 0.9rem;
        font-weight: 600;
        border: 1px solid rgba(138, 180, 248, 0.24);
        transition: all 0.2s ease;
      }

      .tech-tag:hover {
        background: rgba(138, 180, 248, 0.2);
        border-color: rgba(138, 180, 248, 0.4);
        transform: translateY(-2px);
      }

      /* Action Footer */
      .action-footer {
        display: flex;
        justify-content: flex-start;
        gap: 1rem;
        padding-top: 2rem;
        margin-top: 2rem;
        border-top: 1px solid rgba(138, 180, 248, 0.12);
      }

      /* Responsive */
      @media (max-width: 768px) {
        h1 {
          font-size: 2rem;
        }

        .detail-header {
          flex-direction: column;
          gap: 1.5rem;
        }

        .header-actions {
          width: 100%;
          justify-content: flex-start;
        }

        .header-actions .btn {
          flex: 1;
          justify-content: center;
          min-width: 80px;
        }

        .project-meta {
          gap: 1rem;
        }

        .details-section {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .detail-box {
          padding: 1.5rem;
        }

        .btn {
          font-size: 0.9rem;
          padding: 0.75rem 1.25rem;
        }
      }
    `
  ]
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsApiService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProject();
  }

  private loadProject(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid project ID.';
      return;
    }

    this.loading = true;
    this.projectsApi.getById(id).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;

        // Record view asynchronously
        this.projectsApi.recordView(id).subscribe({
          next: (updated) => {
            if (this.project) {
              this.project.viewsCount = updated.viewsCount;
            }
          },
          error: () => {
            // Silently fail - view tracking is not critical
          }
        });
      },
      error: () => {
        this.error = 'Unable to load the project. Please try again later.';
        this.loading = false;
      }
    });
  }

  toggleLike(): void {
    if (!this.project) {
      return;
    }

    if (!this.auth.isLoggedIn) {
      this.error = 'Please log in to like this project.';
      return;
    }

    const request = this.project.userHasLiked
      ? this.projectsApi.unlike(this.project.id)
      : this.projectsApi.like(this.project.id);

    request.subscribe({
      next: (updated) => {
        this.project = updated;
        this.error = '';
      },
      error: () => {
        this.error = 'Unable to update like status. Please try again.';
      }
    });
  }

  getTechs(): string[] {
    if (!this.project?.techStack) {
      return [];
    }
    return this.project.techStack.split(/[,\s]+/).filter((tech) => tech.trim().length > 0);
  }
}
