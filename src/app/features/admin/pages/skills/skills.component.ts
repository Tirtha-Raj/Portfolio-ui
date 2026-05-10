import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Skill } from '../../../../core/models/skill.model';
import { SkillsApiService } from '../../../../data/api/skills.api';

@Component({
  standalone: true,
  selector: 'app-admin-skills',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1>Skill Management</h1>
          <p>Maintain the skill set shown on the portfolio and keep descriptions up to date.</p>
        </div>
      </div>

      <section class="panel panel-form">
        <div class="panel-header">
          <h2>Add New Skill</h2>
        </div>

        <form (ngSubmit)="saveSkill()" class="form-grid">
          <div class="form-group">
            <label for="skillName">Skill Name</label>
            <input
              id="skillName"
              name="name"
              type="text"
              class="form-control"
              [(ngModel)]="skillForm.name"
              required
              placeholder="e.g. Java, Spring Boot"
            />
          </div>

          <div class="form-group">
            <label for="skillCategory">Category</label>
            <input
              id="skillCategory"
              name="category"
              type="text"
              class="form-control"
              [(ngModel)]="skillForm.category"
              placeholder="e.g. Backend, Frontend"
            />
          </div>

          <div class="form-group">
            <label for="skillProficiency">Proficiency</label>
            <input
              id="skillProficiency"
              name="proficiency"
              type="text"
              class="form-control"
              [(ngModel)]="skillForm.proficiency"
              placeholder="e.g. Expert, Intermediate"
            />
          </div>

          <div class="form-actions">
            <span *ngIf="formError" class="text-danger">{{ formError }}</span>
            <span *ngIf="error && !formError" class="text-danger">{{ error }}</span>
            <button class="btn btn-primary" type="submit" [disabled]="saving">
              Add Skill
            </button>
          </div>
        </form>
      </section>

      <section class="panel panel-list">
        <div class="panel-header">
          <h2>Current Skills</h2>
          <span class="status">{{ skills.length }} skills</span>
        </div>

        <div *ngIf="loading" class="empty-state">Loading skills...</div>
        <div *ngIf="!loading && !skills.length" class="empty-state">No skills have been added yet.</div>

        <div class="skill-grid">
          <div *ngFor="let skill of skills" class="skill-card">
            <div>
              <h3>{{ skill.name }}</h3>
              <p *ngIf="skill.category" class="meta">{{ skill.category }}</p>
              <p *ngIf="skill.proficiency" class="meta">{{ skill.proficiency }}</p>
            </div>
            <button class="btn btn-sm btn-outline-danger" type="button" (click)="deleteSkill(skill.id)">
              Delete
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .admin-page {
        max-width: 980px;
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

      .panel {
        background: #0f172a;
        border: 1px solid rgba(148, 163, 184, 0.16);
        border-radius: 1rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
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
        border-radius: 0.75rem;
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
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .empty-state {
        padding: 1.5rem;
        border-radius: 0.75rem;
        background: rgba(148, 163, 184, 0.06);
        color: #94a3b8;
        text-align: center;
      }

      .skill-grid {
        display: grid;
        gap: 1rem;
      }

      .skill-card {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        border-radius: 0.85rem;
        background: #020617;
        border: 1px solid rgba(148, 163, 184, 0.1);
      }

      .skill-card h3 {
        margin: 0 0 0.4rem;
        color: #f8fafc;
      }

      .meta {
        margin: 0;
        color: #94a3b8;
        font-size: 0.95rem;
      }

      @media (max-width: 720px) {
        .skill-card {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `
  ]
})
export class AdminSkillsComponent implements OnInit {
  skills: Skill[] = [];
  loading = false;
  saving = false;
  error = '';
  formError = '';
  skillForm: Partial<Skill> = {
    name: '',
    category: '',
    proficiency: ''
  };

  constructor(private skillsApi: SkillsApiService) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.loading = true;
    this.error = '';

    this.skillsApi.getAll(0, 50).subscribe({
      next: (response) => {
        this.skills = response.content;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load skills right now.';
        this.loading = false;
      }
    });
  }

  saveSkill(): void {
    this.formError = '';
    this.error = '';

    if (!this.skillForm.name?.trim()) {
      this.formError = 'Skill name is required.';
      return;
    }

    this.saving = true;
    this.skillsApi
      .create({
        name: this.skillForm.name.trim(),
        category: this.skillForm.category?.trim() || undefined,
        proficiency: this.skillForm.proficiency?.trim() || undefined
      })
      .subscribe({
        next: (skill) => {
          this.skills.unshift(skill);
          this.skillForm = { name: '', category: '', proficiency: '' };
          this.saving = false;
        },
        error: () => {
          this.error = 'Unable to add skill. Please try again.';
          this.saving = false;
        }
      });
  }

  deleteSkill(skillId: number): void {
    if (!confirm('Remove this skill from the portfolio?')) {
      return;
    }

    this.saving = true;
    this.skillsApi.delete(skillId).subscribe({
      next: () => {
        this.skills = this.skills.filter((skill) => skill.id !== skillId);
        this.saving = false;
      },
      error: () => {
        this.error = 'Unable to delete skill. Please try again.';
        this.saving = false;
      }
    });
  }
}

