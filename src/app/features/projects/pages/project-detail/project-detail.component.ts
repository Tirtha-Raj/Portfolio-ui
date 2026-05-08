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
            <span class="tech-stack">{{ project.techStack }}</span>
            <span class="meta-item">
              <span class="icon">👀</span>
              {{ project.viewsCount | number }} views
            </span>
            <span class="meta-item">
              <span class="icon">❤️</span>
              {{ project.likesCount | number }} likes
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
            <span class="icon">🌐</span> Live Demo
          </a>
          <a
            *ngIf="project.githubUrl"
            [href]="project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-external"
          >
            <span class="icon">💾</span> Source Code
          </a>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Details Section -->
      <div class="details-section">
        <div class="detail-box">
          <h3>About This Project</h3>
          <p>{{ project.description }}</p>
        </div>

        <div class="detail-box">
          <h3>Technologies</h3>
          <div class="tech-tags">
            <span *ngFor="let tech of getTechs()" class="tech-tag">
              {{ tech }}
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="action-footer">
        <a routerLink="/projects" class="btn btn-back">
          ← Back to All Projects
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
        font-size: 1rem;
      }

      /* Alert */
      .alert {
        padding: 1.25rem 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid;
        margin-bottom: 1.5rem;
      }

      .alert-danger {
        background: rgba(248, 113, 113, 0.1);
        border-color: #f87171;
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
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }

      .header-content {
        flex: 1;
        min-width: 0;
      }

      .eyebrow {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.3em;
        color: #8ab4f8;
        margin: 0 0 0.75rem;
        font-weight: 600;
      }

      h1,
      h2,
      h3 {
        color: #e2e8f0;
      }

      h1 {
        margin: 0 0 1rem;
        font-size: 2.75rem;
        font-weight: 700;
        line-height: 1.1;
      }

      .subtitle {
        font-size: 1.1rem;
        color: #cbd5e1;
        margin: 0 0 1.5rem;
        line-height: 1.6;
      }

      .project-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        align-items: center;
      }

      .tech-stack {
        background: rgba(138, 180, 248, 0.1);
        color: #8ab4f8;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: #94a3b8;
        font-size: 0.95rem;
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
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: 0.75rem;
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
        background: rgba(248, 113, 113, 0.1);
        color: #f87171;
        border: 1px solid #f87171;
      }

      .btn-like.liked {
        background: #f87171;
        color: #fff;
      }

      .btn-like:hover {
        background: rgba(248, 113, 113, 0.2);
        transform: translateY(-2px);
      }

      .btn-external {
        background: rgba(138, 180, 248, 0.1);
        color: #8ab4f8;
        border: 1px solid #8ab4f8;
      }

      .btn-external:hover {
        background: rgba(138, 180, 248, 0.2);
        transform: translateY(-2px);
      }

      .btn-back {
        background: rgba(99, 102, 241, 0.1);
        color: #8ab4f8;
        border: 1px solid #6366f1;
      }

      .btn-back:hover {
        background: rgba(99, 102, 241, 0.2);
        transform: translateY(-2px);
      }

      /* Divider */
      .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(138, 180, 248, 0.2), transparent);
        margin: 2rem 0;
      }

      /* Details Section */
      .details-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .detail-box {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(138, 180, 248, 0.1);
        border-radius: 1rem;
        padding: 1.75rem;
        transition: all 0.2s ease;
      }

      .detail-box:hover {
        border-color: #8ab4f8;
        background: rgba(15, 23, 42, 0.8);
      }

      .detail-box h3 {
        margin: 0 0 1rem;
        font-size: 1.2rem;
      }

      .detail-box p {
        color: #cbd5e1;
        line-height: 1.7;
        margin: 0;
      }

      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .tech-tag {
        display: inline-block;
        background: rgba(99, 102, 241, 0.15);
        color: #c7d2fe;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        font-weight: 500;
        border: 1px solid rgba(99, 102, 241, 0.3);
        transition: all 0.2s ease;
      }

      .tech-tag:hover {
        background: rgba(99, 102, 241, 0.25);
        border-color: rgba(99, 102, 241, 0.5);
        transform: translateY(-2px);
      }

      /* Action Footer */
      .action-footer {
        display: flex;
        justify-content: flex-start;
        gap: 1rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(138, 180, 248, 0.1);
      }

      /* Responsive */
      @media (max-width: 768px) {
        h1 {
          font-size: 1.75rem;
        }

        .detail-header {
          flex-direction: column;
        }

        .header-actions {
          width: 100%;
          justify-content: flex-start;
        }

        .header-actions .btn {
          flex: 1;
          justify-content: center;
        }

        .project-meta {
          gap: 1rem;
        }

        .details-section {
          grid-template-columns: 1fr;
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
