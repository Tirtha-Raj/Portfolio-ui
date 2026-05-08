import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SkillsApiService } from '../../../../data/api/skills.api';
import { Skill } from '../../../../core/models/skill.model';

@Component({
  standalone: true,
  selector: 'app-skills-list',
  imports: [CommonModule],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Skills</p>
        <h1>My Technical Skills</h1>
        <p>Proficiencies and technologies I work with.</p>
      </div>
    </section>

    <div *ngIf="error" class="message error">{{ error }}</div>
    <div *ngIf="!skills.length && !loading" class="message">No skills found.</div>

    <div class="skills-grid">
      <div *ngFor="let skill of skills" class="skill-card">
        <h3>{{ skill.name }}</h3>
        <p *ngIf="skill.category">{{ skill.category }}</p>
      </div>
    </div>

    <div *ngIf="loading" class="message">Loading skills...</div>
  `,
  styles: [
    '.page-header { margin-bottom:1.5rem; }',
    '.eyebrow { margin:0 0 .4rem; text-transform:uppercase; color:#6366f1; letter-spacing:.2em; font-size:.8rem; }',
    'h1 { margin:.25rem 0 0; font-size:2rem; }',
    '.skills-grid { display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); }',
    '.skill-card { padding:1.25rem; background:#fff; border-radius:1rem; box-shadow:0 10px 30px rgba(15,23,42,.05); }',
    '.skill-card h3 { margin:0 0 .5rem; }',
    '.skill-card p { margin:0; color:#64748b; font-size:.95rem; }',
    '.message { margin:1rem 0; padding:1rem 1.25rem; background:#f8fafc; border-radius:.75rem; }',
    '.error { background:#fee2e2; color:#991b1b; }'
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
        this.error = 'Unable to load skills.';
        this.loading = false;
      }
    });
  }
}
