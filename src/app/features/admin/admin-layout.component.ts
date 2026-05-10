import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <h2>Admin Panel</h2>
          <p>Manage projects, blogs, skills, and messages.</p>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" class="nav-link">
            <span class="icon">📊</span>
            <span>Dashboard</span>
          </a>

          <a routerLink="/admin/projects" routerLinkActive="active" class="nav-link">
            <span class="icon">📁</span>
            <span>Projects</span>
          </a>

          <a routerLink="/admin/blogs" routerLinkActive="active" class="nav-link">
            <span class="icon">📝</span>
            <span>Blogs</span>
          </a>

          <a routerLink="/admin/skills" routerLinkActive="active" class="nav-link">
            <span class="icon">⚙️</span>
            <span>Skills</span>
          </a>

          <a routerLink="/admin/contact-messages" routerLinkActive="active" class="nav-link">
            <span class="icon">💬</span>
            <span>Messages</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="back-link">
            <span class="icon">←</span>
            <span>Back to Site</span>
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #0b1124;
      }

      .admin-layout {
        display: flex;
        min-height: 100vh;
      }

      .admin-sidebar {
        width: 300px;
        background: #111827;
        border-right: 1px solid #1f2937;
        display: flex;
        flex-direction: column;
        box-shadow: 2px 0 20px rgba(0, 0, 0, 0.35);
      }

      .sidebar-header {
        padding: 1.5rem;
        border-bottom: 1px solid #1f2937;
        color: #e2e8f0;
      }

      .sidebar-header h2 {
        margin: 0;
        font-size: 1.35rem;
        font-weight: 700;
      }

      .sidebar-header p {
        margin: 0.75rem 0 0;
        color: #94a3b8;
        font-size: 0.95rem;
      }

      .sidebar-nav {
        flex: 1;
        padding: 1rem 0;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.95rem 1.5rem;
        color: #cbd5e1;
        text-decoration: none;
        transition: all 0.2s ease;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
      }

      .nav-link:hover {
        background: rgba(148, 163, 184, 0.12);
        color: #f8fafc;
      }

      .nav-link.active {
        background: #2563eb;
        color: #ffffff;
        font-weight: 600;
      }

      .nav-link.active:hover {
        background: #1d4ed8;
      }

      .icon {
        font-size: 1.1rem;
        width: 24px;
        text-align: center;
      }

      .sidebar-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #1f2937;
      }

      .back-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #94a3b8;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s ease;
      }

      .back-link:hover {
        color: #f8fafc;
      }

      .admin-main {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
      }

      @media (max-width: 768px) {
        .admin-layout {
          flex-direction: column;
        }

        .admin-sidebar {
          width: 100%;
          order: 2;
        }

        .admin-main {
          order: 1;
          padding: 1rem;
        }
      }
    `
  ]
})
export class AdminLayoutComponent {}