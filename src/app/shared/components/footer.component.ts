import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <!-- Footer Content -->
        <div class="footer-grid">
          <!-- Brand Section -->
          <div class="footer-section">
            <div class="footer-brand">
              <h3>Backend Portfolio</h3>
            </div>
            <p class="footer-description">
              A modern full-stack portfolio built with Angular & Spring Boot. Showcasing projects, skills, and experience.
            </p>
          </div>

          <!-- Navigation Links -->
          <div class="footer-section">
            <h4 class="section-title">Pages</h4>
            <ul class="footer-links">
              <li><a routerLink="/projects">Projects</a></li>
              <li><a routerLink="/blogs">Blog</a></li>
              <li><a routerLink="/skills">Skills</a></li>
              <li><a routerLink="/contact">Contact</a></li>
            </ul>
          </div>

          <!-- Social Links -->
          <div class="footer-section">
            <h4 class="section-title">Connect</h4>
            <ul class="footer-links">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            </ul>
          </div>
        </div>

        <!-- Divider -->
        <div class="footer-divider"></div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <p class="copyright">&copy; {{ currentYear }} Backend Portfolio. Crafted with care.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: rgba(5, 11, 20, 0.8);
        border-top: 1px solid rgba(138, 180, 248, 0.12);
        margin-top: auto;
        padding: 3rem 1rem 1.5rem;
      }

      .footer-container {
        max-width: 1180px;
        margin: 0 auto;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2.5rem;
        margin-bottom: 2.5rem;
      }

      .footer-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .footer-brand h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--text);
        letter-spacing: -0.02em;
      }

      .footer-description {
        margin: 0;
        color: var(--muted);
        font-size: 0.95rem;
        line-height: 1.6;
      }

      .section-title {
        margin: 0 0 0.75rem;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .footer-links {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .footer-links a {
        color: var(--muted);
        text-decoration: none;
        font-size: 0.95rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .footer-links a:hover {
        color: var(--primary);
        transform: translateX(4px);
      }

      .footer-divider {
        height: 1px;
        background: rgba(138, 180, 248, 0.12);
        margin-bottom: 2rem;
      }

      .footer-bottom {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .copyright {
        margin: 0;
        color: var(--muted);
        font-size: 0.9rem;
        text-align: center;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .footer {
          padding: 2rem 1rem 1rem;
        }

        .footer-grid {
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .footer-links a:hover {
          transform: translateX(2px);
        }
      }
    `
  ]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
