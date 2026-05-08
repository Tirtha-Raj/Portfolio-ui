import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-loading',
  imports: [CommonModule],
  template: `
    <div class="loading-container">
      <div class="spinner"></div>
      <p class="loading-text">{{ text }}</p>
    </div>
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        gap: 1rem;
      }

      .spinner {
        width: 3rem;
        height: 3rem;
        border: 3px solid #334155;
        border-top: 3px solid #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .loading-text {
        color: #cbd5e1;
        font-size: 0.95rem;
        margin: 0;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `
  ]
})
export class LoadingComponent {
  text = 'Loading...';
}
