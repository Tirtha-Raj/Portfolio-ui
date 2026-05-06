import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ApiService, Blog } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-blog-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="loading" class="message">Loading blog...</div>
    <div *ngIf="error" class="message error">{{ error }}</div>

    <article *ngIf="blog" class="blog-detail-card">
      <p class="eyebrow">Blog post</p>
      <h1>{{ blog.title }}</h1>
      <p class="meta">Views: {{ blog.views }}</p>
      <div class="blog-body">{{ blog.content }}</div>
      <a routerLink="/blogs" class="back-link">← Back to blog list</a>
    </article>
  `,
  styles: [
    '.blog-detail-card { padding:1.5rem; background:#fff; border-radius:1rem; box-shadow:0 14px 35px rgba(15,23,42,.08); }',
    '.eyebrow { margin:0 0 .4rem; text-transform:uppercase; letter-spacing:.2em; color:#6366f1; font-size:.8rem; }',
    'h1 { margin:0 0 .75rem; font-size:2rem; }',
    '.meta { margin:0 0 1rem; color:#475569; }',
    '.blog-body { white-space:pre-wrap; line-height:1.75; color:#334155; margin-bottom:1.5rem; }',
    '.back-link { color:#4338ca; text-decoration:none; font-weight:600; }',
    '.message { margin:1rem 0; padding:1rem 1.25rem; background:#f8fafc; border-radius:.75rem; }',
    '.error { background:#fee2e2; color:#991b1b; }'
  ]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid blog id.';
      return;
    }

    this.loading = true;
    this.api.getBlogById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;
        this.api.incrementBlogViews(id).subscribe({
          next: (updated) => {
            if (this.blog) {
              this.blog.views = updated.views;
            }
          }
        });
      },
      error: () => {
        this.error = 'Unable to load the blog post.';
        this.loading = false;
      }
    });
  }
}
