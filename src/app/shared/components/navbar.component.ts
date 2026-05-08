import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top border-bottom border-secondary">
      <div class="container-fluid px-4">
        <a class="navbar-brand fw-bold" routerLink="/">
          <span class="brand-icon">{{ '{' }}</span>
          <span class="brand-text">portfolio</span>
          <span class="brand-icon">{{ '}' }}</span>
        </a>

        <button
          class="navbar-toggler border-0"
          type="button"
          (click)="toggleMenu()"
          [attr.aria-expanded]="isMenuOpen"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" [class.show]="isMenuOpen">
          <ul class="navbar-nav ms-auto gap-2">
            <li class="nav-item">
              <a class="nav-link" routerLink="/projects" routerLinkActive="active" (click)="closeMenu()">
                Projects
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/blogs" routerLinkActive="active" (click)="closeMenu()">
                Blog
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/skills" routerLinkActive="active" (click)="closeMenu()">
                Skills
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">
                Contact
              </a>
            </li>

            <li class="nav-item" *ngIf="auth.isLoggedIn">
              <a class="nav-link" [class.active]="auth.isAdmin" routerLink="/admin" (click)="closeMenu()">
                Admin
              </a>
            </li>

            <li class="nav-item border-start border-secondary ps-2 ms-2">
              <a
                *ngIf="!auth.isLoggedIn"
                class="nav-link btn btn-sm btn-outline-primary"
                routerLink="/login"
                (click)="closeMenu()"
              >
                Login
              </a>
              <button
                *ngIf="auth.isLoggedIn"
                class="nav-link btn btn-sm btn-outline-danger"
                (click)="logout()"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      :host {
        --bs-navbar-padding-y: 0.75rem;
      }

      .navbar-brand {
        font-size: 1.3rem;
        letter-spacing: 0.05em;
      }

      .brand-icon {
        color: #6366f1;
        font-weight: bold;
      }

      .brand-text {
        color: #e2e8f0;
      }

      .nav-link {
        transition: all 0.2s ease;
        color: #cbd5e1 !important;
        font-weight: 500;
        font-size: 0.95rem;
      }

      .nav-link:hover {
        color: #6366f1 !important;
      }

      .nav-link.active {
        color: #6366f1 !important;
        border-bottom: 2px solid #6366f1;
        padding-bottom: 0.35rem;
      }

      .btn-outline-primary {
        color: #6366f1;
        border-color: #6366f1;
      }

      .btn-outline-primary:hover {
        background-color: #6366f1;
        border-color: #6366f1;
      }

      .btn-outline-danger:hover {
        background-color: #dc2626;
        border-color: #dc2626;
      }
    `
  ]
})
export class NavbarComponent {
  @Input() title = 'Portfolio';
  isMenuOpen = false;

  constructor(public auth: AuthService) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.closeMenu();
  }
}
