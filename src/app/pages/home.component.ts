import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService, Project } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Portfolio</p>
        <h1>Featured projects</h1>
        <p>Browse the latest portfolio projects and open a detail view to like or inspect each item.</p>
      </div>
      <div class="search-panel">
        <input
          type="text"
          placeholder="Search projects"
          [(ngModel)]="searchTerm"
          (keyup.enter)="loadProjects()"
        />
        <button (click)="loadProjects()">Search</button>
      </div>
    </section>

    <section *ngIf="error" class="message error">{{ error }}</section>
    <section *ngIf="!projects.length && !loading" class="message">No projects found.</section>

    <div class="card-grid">
      <article *ngFor="let project of projects" class="card">
        <div class="card-header">
          <h2>{{ project.title }}</h2>
          <span class="badge">{{ project.likesCount }} ❤️</span>
        </div>
        <p class="meta">Views: {{ project.viewsCount }} · {{ project.techStack }}</p>
        <p>{{ project.description }}</p>
        <div class="card-actions">
          <a [routerLink]="['/projects', project.id]">View details</a>
          <button class="like-button" (click)="toggleLike(project)">
            {{ project.userHasLiked ? 'Unlike' : 'Like' }}
          </button>
        </div>
      </article>
    </div>

    <div *ngIf="loading" class="message">Loading projects...</div>
  `,
  styles: [
    '.page-header { display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; flex-wrap:wrap; margin-bottom:1.5rem; }',
    '.eyebrow { text-transform:uppercase; font-size:.8rem; letter-spacing:.3em; color:#6366f1; margin:0 0 .3rem; }',
    'h1 { margin:0 0 .5rem; font-size:2rem; }',
    '.search-panel { display:flex; gap:.75rem; flex-wrap:wrap; }',
    'input { min-width:260px; padding:.75rem 1rem; border:1px solid #d1d5db; border-radius:.75rem; }',
    'button { padding:.75rem 1rem; border:none; border-radius:.75rem; background:#4f46e5; color:#fff; cursor:pointer; }',
    '.card-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1rem; }',
    '.card { padding:1.25rem; background:#fff; border-radius:1rem; box-shadow:0 10px 30px rgba(15,23,42,.05); }',
    '.card-header { display:flex; justify-content:space-between; gap:1rem; align-items:center; margin-bottom:.75rem; }',
    '.badge { background:#eef2ff; color:#4338ca; padding:.3rem .75rem; border-radius:999px; font-size:.8rem; font-weight:700; }',
    '.meta { margin:.25rem 0 .85rem; color:#6b7280; font-size:.95rem; }',
    '.card-actions { display:flex; justify-content:space-between; align-items:center; gap:.75rem; margin-top:1rem; }',
    'a { color:#4338ca; text-decoration:none; font-weight:600; }',
    '.like-button { background:#f59e0b; border:none; color:#111827; padding:.65rem 1rem; border-radius:.75rem; cursor:pointer; }',
    '.message { margin:1rem 0; padding:1rem 1.25rem; background:#f8fafc; border-radius:.75rem; color:#334155; }',
    '.error { background:#fee2e2; color:#991b1b; }'
  ]
})
export class HomeComponent implements OnInit {
  projects: Project[] = [];
  searchTerm = '';
  loading = false;
  error = '';

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = '';
    const request = this.searchTerm?.trim()
      ? this.api.searchProjects(this.searchTerm.trim(), 0, 20)
      : this.api.getProjects(0, 20);

    request.subscribe({
      next: (response) => {
        this.projects = response.content;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load projects. Please try again later.';
        this.loading = false;
      }
    });
  }

  toggleLike(project: Project): void {
    if (!this.auth.isLoggedIn) {
      this.error = 'Login to like projects.';
      return;
    }

    const action = project.userHasLiked ? this.api.unlikeProject(project.id) : this.api.likeProject(project.id);
    action.subscribe({
      next: (updated) => {
        const index = this.projects.findIndex((item) => item.id === updated.id);
        if (index >= 0) {
          this.projects[index] = updated;
        }
      },
      error: () => {
        this.error = 'Unable to update project like state. Please try again.';
      }
    });
  }
}
