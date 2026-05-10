import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Blog } from '../../../../core/models/blog.model';
import { BlogsApiService } from '../../../../data/api/blogs.api';

@Component({
  standalone: true,
  selector: 'app-admin-blogs',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1>Blog Management</h1>
          <p>Create and publish new blog posts from the admin dashboard.</p>
        </div>
      </div>

      <section class="panel panel-form">
        <div class="panel-header">
          <h2>New Blog Post</h2>
        </div>

        <form (ngSubmit)="saveBlog()" class="form-grid">
          <div class="form-group">
            <label for="blogTitle">Title</label>
            <input
              id="blogTitle"
              name="title"
              type="text"
              class="form-control"
              [(ngModel)]="blogForm.title"
              required
              placeholder="Article title"
            />
          </div>

          <div class="form-group full-width">
            <label for="blogContent">Content</label>
            <textarea
              id="blogContent"
              name="content"
              class="form-control"
              rows="8"
              [(ngModel)]="blogForm.content"
              required
              placeholder="Write your blog content here"
            ></textarea>
          </div>

          <div class="form-actions">
            <span *ngIf="formError" class="text-danger">{{ formError }}</span>
            <span *ngIf="error && !formError" class="text-danger">{{ error }}</span>
            <button class="btn btn-primary" type="submit" [disabled]="saving">
              Publish Blog
            </button>
          </div>
        </form>
      </section>

      <section class="panel panel-list">
        <div class="panel-header">
          <h2>Blog Posts</h2>
          <span class="status">{{ blogs.length }} posts</span>
        </div>

        <div *ngIf="loading" class="empty-state">Loading blog posts...</div>
        <div *ngIf="!loading && !blogs.length" class="empty-state">No blog posts available.</div>

        <div class="blog-list">
          <article *ngFor="let blog of blogs" class="blog-item">
            <div class="blog-header">
              <h3>{{ blog.title }}</h3>
              <span class="blog-meta">{{ blog.views | number }} views</span>
            </div>
            <p>{{ blog.content | slice:0:180 }}{{ blog.content.length > 180 ? '...' : '' }}</p>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .admin-page {
        max-width: 1100px;
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
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .full-width {
        grid-column: 1 / -1;
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

      .blog-list {
        display: grid;
        gap: 1rem;
      }

      .blog-item {
        padding: 1.25rem;
        border-radius: 0.85rem;
        background: #020617;
        border: 1px solid rgba(148, 163, 184, 0.1);
      }

      .blog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }

      .blog-item h3 {
        margin: 0;
        color: #f8fafc;
      }

      .blog-meta {
        color: #94a3b8;
        font-size: 0.9rem;
      }

      .blog-item p {
        margin: 0;
        color: #cbd5e1;
        line-height: 1.6;
      }
    `
  ]
})
export class AdminBlogsComponent implements OnInit {
  blogs: Blog[] = [];
  blogForm = { title: '', content: '' };
  loading = false;
  saving = false;
  error = '';
  formError = '';

  constructor(private blogsApi: BlogsApiService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = '';
    this.blogsApi.getAll(0, 50).subscribe({
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

  saveBlog(): void {
    this.formError = '';
    this.error = '';

    if (!this.blogForm.title.trim() || !this.blogForm.content.trim()) {
      this.formError = 'Title and content are required.';
      return;
    }

    this.saving = true;
    this.blogsApi
      .create({
        title: this.blogForm.title.trim(),
        content: this.blogForm.content.trim()
      })
      .subscribe({
        next: (blog) => {
          this.blogs.unshift(blog);
          this.blogForm = { title: '', content: '' };
          this.saving = false;
        },
        error: () => {
          this.error = 'Unable to publish the blog. Please try again.';
          this.saving = false;
        }
      });
  }
}

