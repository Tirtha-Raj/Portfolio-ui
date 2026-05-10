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
        <!-- Brand -->
        <a class="navbar-brand" routerLink="/">
          <span class="brand-wrapper">
            <span class="brand-icon">{{ '{' }}</span>
            <span class="brand-text">
              <span class="brand-title">Tirtharaj's Portfolio</span>
              <span class="brand-subtitle">Backend Developer</span>
            </span>
            <span class="brand-icon">{{ '}' }}</span>
          </span>
        </a>

        <!-- Toggler Button -->
        <button
          class="navbar-toggler border-0"
          type="button"
          (click)="toggleMenu()"
          [attr.aria-expanded]="isMenuOpen"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Collapse Wrapper -->
        <div class="collapse navbar-collapse" [class.show]="isMenuOpen" #navbarCollapse>
          <!-- Navigation Items -->
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/projects"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: false }"
                (click)="closeMenu()"
              >
                Projects
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/blogs"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: false }"
                (click)="closeMenu()"
              >
                Blog
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/skills"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: false }"
                (click)="closeMenu()"
              >
                Skills
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/contact"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: false }"
                (click)="closeMenu()"
              >
                Contact
              </a>
            </li>

            <!-- Admin Link (logged-in only) -->
            <li class="nav-item" *ngIf="auth.isLoggedIn">
              <a
                class="nav-link"
                [class.active]="auth.isAdmin"
                routerLink="/admin"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: false }"
                (click)="closeMenu()"
              >
                Admin
              </a>
            </li>

            <!-- Auth Button -->
            <li class="nav-item ms-lg-3 ps-lg-2 border-start border-secondary">
              <a
                *ngIf="!auth.isLoggedIn"
                class="nav-link btn-auth"
                routerLink="/login"
                (click)="closeMenu()"
              >
                Login
              </a>
              <button *ngIf="auth.isLoggedIn" class="nav-link btn-auth btn-logout" type="button" (click)="logout()">
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
        --bs-navbar-padding-y: 0.65rem;
        display: block;
      }

      .navbar {
        background-color: #1f2937 !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      /* ===== BRAND STYLES ===== */
      .navbar-brand {
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: #f8fafc !important;
        display: flex;
        align-items: center;
        white-space: nowrap;
        padding: 0.5rem 0;
      }

      .brand-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .brand-icon {
        color: #818cf8;
        font-weight: 700;
        font-size: 1.1em;
      }

      .brand-text {
        display: flex;
        flex-direction: column;
        line-height: 1;
      }

      .brand-title {
        color: #f8fafc;
        font-weight: 700;
        font-size: 0.95rem;
      }

      .brand-subtitle {
        color: #94a3b8;
        font-size: 0.7rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-top: 0.15rem;
      }

      /* ===== NAVBAR NAV STYLES ===== */
      .navbar-nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        list-style: none;
        margin-bottom: 0;
        margin-left: auto;
      }

      .collapse.navbar-collapse {
        display: flex !important;
        flex-direction: row;
      }

      .nav-item {
        display: flex;
        align-items: center;
        white-space: nowrap;
      }

      .nav-link {
        color: #cbd5e1 !important;
        font-weight: 500;
        font-size: 0.92rem;
        padding: 0.6rem 0.9rem !important;
        white-space: nowrap;
        transition: all 0.2s ease;
        border-radius: 0.4rem;
      }

      .nav-link:hover {
        color: #ffffff !important;
        background-color: rgba(255, 255, 255, 0.1);
      }

      .nav-link.active {
        color: #818cf8 !important;
        background-color: rgba(129, 140, 248, 0.15);
      }

      /* ===== AUTH BUTTON STYLES ===== */
      .btn-auth {
        color: #818cf8 !important;
        border-radius: 0.4rem;
        border: 1px solid rgba(129, 140, 248, 0.4);
        padding: 0.45rem 1rem !important;
        font-weight: 500;
        font-size: 0.9rem;
        background-color: transparent;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-auth:hover {
        color: #ffffff !important;
        background-color: rgba(129, 140, 248, 0.2);
        border-color: #818cf8;
      }

      .btn-logout {
        color: #f87171 !important;
        border-color: rgba(248, 113, 113, 0.4);
      }

      .btn-logout:hover {
        color: #ffffff !important;
        background-color: rgba(248, 113, 113, 0.15);
        border-color: #f87171;
      }

      /* ===== MOBILE RESPONSIVE ===== */
      @media (max-width: 991.98px) {
        .navbar-toggler {
          display: block !important;
        }

        .collapse.navbar-collapse {
          display: none !important;
          flex-direction: column;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: #1f2937;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .collapse.navbar-collapse.show {
          display: flex !important;
        }

        .navbar-nav {
          flex-direction: column;
          gap: 0;
          margin-left: 0;
          width: 100%;
        }

        .nav-item {
          width: 100%;
          justify-content: flex-start;
        }

        .nav-link {
          width: 100%;
          padding: 0.75rem 1rem !important;
          border-radius: 0;
        }

        .border-start {
          border: none !important;
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          margin-left: 0 !important;
          padding-left: 0 !important;
        }

        .btn-auth {
          width: 100%;
        }
      }

      @media (min-width: 992px) {
        .navbar-toggler {
          display: none !important;
        }
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
