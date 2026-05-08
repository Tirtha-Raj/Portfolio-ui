import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-dark border-top border-secondary mt-5 py-4">
      <div class="container-fluid px-4">
        <div class="row g-4 mb-4">
          <div class="col-md-4">
            <h5 class="text-light mb-3">Portfolio</h5>
            <p class="text-secondary">
              A modern full-stack portfolio showcasing projects, skills, and experience.
            </p>
          </div>

          <div class="col-md-4">
            <h5 class="text-light mb-3">Quick Links</h5>
            <ul class="list-unstyled gap-2 d-flex flex-column">
              <li><a routerLink="/" class="text-decoration-none text-secondary">Projects</a></li>
              <li><a routerLink="/blogs" class="text-decoration-none text-secondary">Blog</a></li>
              <li><a routerLink="/skills" class="text-decoration-none text-secondary">Skills</a></li>
              <li><a routerLink="/contact" class="text-decoration-none text-secondary">Contact</a></li>
            </ul>
          </div>

          <div class="col-md-4">
            <h5 class="text-light mb-3">Connect</h5>
            <ul class="list-unstyled gap-2 d-flex flex-column">
              <li><a href="#" class="text-decoration-none text-secondary">GitHub</a></li>
              <li><a href="#" class="text-decoration-none text-secondary">LinkedIn</a></li>
              <li><a href="#" class="text-decoration-none text-secondary">Twitter</a></li>
            </ul>
          </div>
        </div>

        <hr class="border-secondary my-3" />

        <div class="text-center text-secondary">
          <p class="mb-0">&copy; 2026 Portfolio. Built with Angular & Spring Boot.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      footer {
        margin-top: auto;
      }

      a {
        transition: color 0.2s ease;
      }

      a:hover {
        color: #6366f1 !important;
      }

      h5 {
        font-weight: 600;
        letter-spacing: 0.05em;
      }
    `
  ]
})
export class FooterComponent {}
