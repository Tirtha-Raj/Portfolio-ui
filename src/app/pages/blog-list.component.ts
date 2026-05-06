import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService, Blog } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-blog-list',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Blog</p>
        <h1>Latest stories</h1>
        <p>Read the latest portfolio updates, developer notes, and project stories.</p>
      </div>
    </section>

    <div *ngIf="error" class="message error">{{ error }}</div>
    <div *ngIf="!blogs.length && !loading" class="message">No blog posts found.</div>

    <div class="blog-grid">
      <article *ngFor="let blog of blogs" class="blog-card">
        <h2>{{ blog.title }}</h2>
        <p class="meta">{{ blog.views }} views</p>
        <p>{{ blog.content.slice(0, 180) }}{{ blog.content.length > 180 ? '...' : '' }}</p>
        <a [routerLink]="['/blogs', blog.id]">Read story</a>
      </article>
    </div>

    <div *ngIf="loading" class="message">Loading blog posts...</div>
  `,
  styles: [
    '.page-header { margin-bottom:1.5rem; }',
    '.eyebrow { margin:0 0 .4rem; text-transform:uppercase; color:#6366f1; letter-spacing:.2em; font-size:.8rem; }',
    'h1 { margin:.25rem 0 0; font-size:2rem; }',
    '.blog-grid { display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); }',
    '.blog-card { padding:1.25rem; background:#fff; border-radius:1rem; box-shadow:0 10px 30px rgba(15,23,42,.05); }',
    '.meta { margin:.5rem 0; color:#64748b; font-size:.95rem; }',
    'a { color:#4338ca; font-weight:600; text-decoration:none; }',
    '.message { margin:1rem 0; padding:1rem 1.25rem; background:#f8fafc; border-radius:.75rem; }',
    '.error { background:#fee2e2; color:#991b1b; }'
  ]
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getBlogs(0, 20).subscribe({
      next: (response) => {
        this.blogs = response.content;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load blog posts.';
        this.loading = false;
      }
    });
  }
}
