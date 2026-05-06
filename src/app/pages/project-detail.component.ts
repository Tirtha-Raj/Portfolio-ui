import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ApiService, Project } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="loading" class="message">Loading project...</div>
    <div *ngIf="error" class="message error">{{ error }}</div>

    <section *ngIf="project" class="detail-card">
      <div class="detail-header">
        <div>
          <p class="eyebrow">Project detail</p>
          <h1>{{ project.title }}</h1>
          <p class="meta">{{ project.techStack }} · Views {{ project.viewsCount }} · Likes {{ project.likesCount }}</p>
        </div>
        <div class="actions">
          <button class="secondary" (click)="toggleLike()">
            {{ project.userHasLiked ? 'Unlike' : 'Like' }}
          </button>
          <a *ngIf="project.liveUrl" [href]="project.liveUrl" target="_blank">Live demo</a>
          <a *ngIf="project.githubUrl" [href]="project.githubUrl" target="_blank">Source</a>
        </div>
      </div>

      <p class="description">{{ project.description }}</p>
      <a routerLink="/" class="back-link">← Back to projects</a>
    </section>
  `,
  styles: [
    '.detail-card { padding:1.5rem; background:#fff; border-radius:1rem; box-shadow:0 14px 35px rgba(15,23,42,.08); }',
    '.detail-header { display:flex; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom:1rem; }',
    '.eyebrow { margin:0 0 .4rem; text-transform:uppercase; color:#7c3aed; letter-spacing:.2em; font-size:.8rem; }',
    'h1 { margin:0; font-size:2rem; }',
    '.meta { margin:.75rem 0 0; color:#475569; }',
    '.actions { display:flex; flex-wrap:wrap; gap:.75rem; align-items:center; }',
    'button, a { border-radius:.85rem; padding:.75rem 1rem; text-decoration:none; font-weight:600; }',
    'button { border:none; background:#4f46e5; color:#fff; cursor:pointer; }',
    'a { color:#4f46e5; background:#eef2ff; }',
    '.description { margin:1.5rem 0; color:#334155; line-height:1.8; }',
    '.back-link { display:inline-block; margin-top:1rem; color:#4338ca; }',
    '.message { margin:1rem 0; padding:1rem 1.25rem; background:#f8fafc; border-radius:.75rem; }',
    '.error { background:#fee2e2; color:#991b1b; }'
  ]
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProject();
  }

  private loadProject(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid project id.';
      return;
    }

    this.loading = true;
    this.api.getProject(id).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
        this.api.incrementProjectViews(id).subscribe({
          next: (updated) => {
            if (this.project) {
              this.project.viewsCount = updated.viewsCount;
            }
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
      this.error = 'Login to like this project.';
      return;
    }

    const request = this.project.userHasLiked
      ? this.api.unlikeProject(this.project.id)
      : this.api.likeProject(this.project.id);

    request.subscribe({
      next: (updated) => {
        this.project = updated;
      },
      error: () => {
        this.error = 'Unable to update like status. Please try again.';
      }
    });
  }
}
