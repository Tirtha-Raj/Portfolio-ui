import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../../../core/models/project.model';
import { ProjectsApiService } from '../../../../data/api/projects.api';

@Component({
  standalone: true,
  selector: 'app-admin-projects',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1>Manage Projects</h1>
          <p>Use this panel to create or update portfolio projects and keep the list current.</p>
        </div>
      </div>

      <div class="admin-grid">
        <section class="panel panel-form">
          <div class="panel-header">
            <h2>{{ editingProjectId ? 'Edit Project' : 'Add New Project' }}</h2>
          </div>

          <form (ngSubmit)="saveProject()" class="form-grid">
            <div class="form-group">
              <label for="projectTitle">Title</label>
              <input
                id="projectTitle"
                name="title"
                type="text"
                class="form-control"
                [(ngModel)]="projectForm.title"
                required
                placeholder="Project title"
              />
            </div>

            <div class="form-group">
              <label for="projectDescription">Description</label>
              <textarea
                id="projectDescription"
                name="description"
                class="form-control"
                rows="4"
                [(ngModel)]="projectForm.description"
                required
                placeholder="Short project overview"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="projectTech">Tech Stack</label>
              <input
                id="projectTech"
                name="techStack"
                type="text"
                class="form-control"
                [(ngModel)]="projectForm.techStack"
                placeholder="e.g. Spring Boot, Angular, PostgreSQL"
              />
            </div>

            <div class="form-group">
              <label for="projectGithub">GitHub URL</label>
              <input
                id="projectGithub"
                name="githubUrl"
                type="url"
                class="form-control"
                [(ngModel)]="projectForm.githubUrl"
                placeholder="https://github.com/..."
              />
            </div>

            <div class="form-group">
              <label for="projectLive">Live URL</label>
              <input
                id="projectLive"
                name="liveUrl"
                type="url"
                class="form-control"
                [(ngModel)]="projectForm.liveUrl"
                placeholder="https://..."
              />
            </div>

            <div class="form-actions">
              <div class="form-messages">
                <span *ngIf="formError" class="text-danger">{{ formError }}</span>
                <span *ngIf="error && !formError" class="text-danger">{{ error }}</span>
              </div>
              <div class="button-row">
                <button class="btn btn-primary" type="submit" [disabled]="processing">
                  {{ editingProjectId ? 'Save Changes' : 'Create Project' }}
                </button>
                <button
                  *ngIf="editingProjectId"
                  type="button"
                  class="btn btn-outline-secondary"
                  (click)="cancelEdit()"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </section>

        <section class="panel panel-list">
          <div class="panel-header">
            <h2>Project List</h2>
            <span class="status">{{ projects.length }} projects loaded</span>
          </div>

          <div *ngIf="loading" class="empty-state">Loading projects...</div>
          <div *ngIf="!loading && !projects.length" class="empty-state">No projects found.</div>

          <div *ngFor="let project of projects" class="item-card">
            <div class="item-card-content">
              <div>
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
                <p class="meta">{{ project.techStack }}</p>
              </div>
              <div class="item-badges">
                <span class="badge badge-secondary">Views: {{ project.viewsCount | number }}</span>
                <span class="badge badge-secondary">Likes: {{ project.likesCount | number }}</span>
              </div>
            </div>

            <div class="item-actions">
              <div class="links">
                <a *ngIf="project.githubUrl" [href]="project.githubUrl" target="_blank" rel="noreferrer" class="link-button">GitHub</a>
                <a *ngIf="project.liveUrl" [href]="project.liveUrl" target="_blank" rel="noreferrer" class="link-button">Live</a>
              </div>
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline-primary" type="button" (click)="editProject(project)">
                  Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" type="button" (click)="deleteProject(project.id)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-page {
        max-width: 1200px;
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

      .admin-grid {
        display: grid;
        gap: 1.5rem;
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

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-control {
        background: #020617;
        border: 1px solid rgba(148, 163, 184, 0.2);
        color: #e2e8f0;
        border-radius: 0.65rem;
        padding: 0.9rem 1rem;
      }

      .form-control:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 0.15rem rgba(99, 102, 241, 0.2);
      }

      .form-actions {
        grid-column: 1 / -1;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-top: 0.5rem;
      }

      .button-row {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .btn-primary,
      .btn-outline-secondary {
        min-width: 140px;
      }

      .empty-state {
        padding: 1.5rem;
        border-radius: 0.75rem;
        background: rgba(148, 163, 184, 0.06);
        color: #94a3b8;
      }

      .item-card {
        background: #020617;
        border: 1px solid rgba(148, 163, 184, 0.1);
        border-radius: 0.85rem;
        padding: 1.25rem;
        display: grid;
        gap: 1rem;
      }

      .item-card-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 1rem;
      }

      .item-card h3 {
        margin: 0 0 0.5rem;
        color: #f8fafc;
      }

      .item-card p {
        margin: 0 0.75rem;
        color: #cbd5e1;
      }

      .meta {
        color: #94a3b8;
        font-size: 0.95rem;
      }

      .item-badges {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .badge {
        padding: 0.45rem 0.75rem;
        border-radius: 999px;
        font-size: 0.8rem;
        color: #e2e8f0;
        background: rgba(99, 102, 241, 0.16);
      }

      .item-actions {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
      }

      .links {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .link-button {
        color: #8b5cf6;
        text-decoration: none;
        font-size: 0.95rem;
      }

      .link-button:hover {
        text-decoration: underline;
      }

      .action-buttons {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      @media (max-width: 900px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AdminProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  processing = false;
  error = '';
  formError = '';
  editingProjectId?: number;
  projectForm: Partial<Project> = {
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: ''
  };

  constructor(private projectsApi: ProjectsApiService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = '';
    this.projectsApi.getAll(0, 50).subscribe({
      next: (response) => {
        this.projects = response.content;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load projects at the moment.';
        this.loading = false;
      }
    });
  }

  editProject(project: Project): void {
    this.editingProjectId = project.id;
    this.projectForm = {
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      githubUrl: project.githubUrl ?? '',
      liveUrl: project.liveUrl ?? ''
    };
    this.formError = '';
  }

  cancelEdit(): void {
    this.editingProjectId = undefined;
    this.resetForm();
  }

  saveProject(): void {
    this.formError = '';
    this.error = '';

    if (!this.projectForm.title?.trim() || !this.projectForm.description?.trim()) {
      this.formError = 'Title and description are required.';
      return;
    }

    const payload = {
      title: this.projectForm.title.trim(),
      description: this.projectForm.description.trim(),
      techStack: this.projectForm.techStack?.trim() ?? '',
      githubUrl: this.projectForm.githubUrl?.trim() || undefined,
      liveUrl: this.projectForm.liveUrl?.trim() || undefined
    };

    this.processing = true;

    const request$ = this.editingProjectId
      ? this.projectsApi.update(this.editingProjectId, payload)
      : this.projectsApi.create(payload as Omit<Project, 'id' | 'viewsCount' | 'likesCount' | 'userHasLiked' | 'createdAt' | 'updatedAt'>);

    request$.subscribe({
      next: () => {
        this.loadProjects();
        this.resetForm();
        this.editingProjectId = undefined;
        this.processing = false;
      },
      error: () => {
        this.error = 'Unable to save the project. Please try again.';
        this.processing = false;
      }
    });
  }

  deleteProject(projectId: number): void {
    if (!confirm('Delete this project permanently?')) {
      return;
    }

    this.processing = true;
    this.projectsApi.delete(projectId).subscribe({
      next: () => {
        if (this.editingProjectId === projectId) {
          this.cancelEdit();
        }
        this.loadProjects();
        this.processing = false;
      },
      error: () => {
        this.error = 'Unable to delete the project. Please try again.';
        this.processing = false;
      }
    });
  }

  private resetForm(): void {
    this.projectForm = {
      title: '',
      description: '',
      techStack: '',
      githubUrl: '',
      liveUrl: ''
    };
  }
}

