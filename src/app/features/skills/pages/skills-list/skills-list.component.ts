import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SkillsApiService } from '../../../../data/api/skills.api';
import { Skill } from '../../../../core/models/skill.model';

@Component({
  standalone: true,
  selector: 'app-skills-list',
  imports: [CommonModule],
  template: `
    <!-- Header Section -->
    <div class="skills-header">
      <div class="header-content">
        <p class="eyebrow">Skills</p>
        <h1>Technical Expertise</h1>
        <p class="subtitle">Languages, frameworks, and tools I work with regularly.</p>
      </div>
    </div>

    <!-- Error Message -->
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

    <!-- Empty State -->
    <div *ngIf="!skills.length && !loading" class="empty-state">
      <p>No skills found. Check back soon!</p>
    </div>

    <!-- Skills Grid -->
    <div *ngIf="skills.length" class="skills-grid">
      <div *ngFor="let skill of skills; let i = index" class="skill-card" [style.animation-delay]="i * 0.05 + 's'">
        <div class="skill-content">
          <h3 class="skill-name">{{ skill.name }}</h3>
          <p *ngIf="skill.category" class="skill-category">{{ skill.category }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading skills...</p>
    </div>
  `,
  styles: [
    `
      .skills-header {
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(138, 180, 248, 0.12);
      }

      .header-content {
        margin-bottom: 0;
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

      .subtitle {
        color: var(--muted);
        font-size: 1.1rem;
        margin: 0;
        line-height: 1.6;
      }

      /* Alert Messages */
      .alert {
        padding: 1rem 1.5rem;
        border-radius: 0.85rem;
        margin-bottom: 2rem;
        border: 1px solid;
      }

      .alert-danger {
        background: rgba(248, 113, 113, 0.12);
        border-color: rgba(248, 113, 113, 0.3);
        color: #fecaca;
      }

      /* Skills Grid */
      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .skill-card {
        padding: 1.75rem;
        background: rgba(11, 18, 33, 0.6);
        border: 1px solid rgba(138, 180, 248, 0.12);
        border-radius: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .skill-card:hover {
        border-color: var(--primary);
        background: rgba(11, 18, 33, 0.8);
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(138, 180, 248, 0.1);
      }

      .skill-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .skill-name {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text);
        line-height: 1.4;
      }

      .skill-category {
        margin: 0;
        color: var(--primary);
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* Empty State */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
        background: rgba(11, 18, 33, 0.4);
        border: 1px solid rgba(138, 180, 248, 0.12);
        border-radius: 1rem;
      }

      .empty-state p {
        color: var(--muted);
        font-size: 1.1rem;
        margin: 0;
      }

      /* Loading State */
      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(138, 180, 248, 0.2);
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
        margin: 0;
      }

      /* Responsive */
      @media (max-width: 768px) {
        h1 {
          font-size: 2rem;
        }

        .skills-grid {
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.25rem;
        }

        .skill-card {
          padding: 1.5rem;
        }
      }
    `
  ]
})
export class SkillsListComponent implements OnInit {
  skills: Skill[] = [];
  loading = false;
  error = '';

  constructor(private skillsApi: SkillsApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.skillsApi.getAll(0, 100).subscribe({
      next: (response) => {
        this.skills = response.content;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load skills. Please try again later.';
        this.loading = false;
      }
    });
  }
}
