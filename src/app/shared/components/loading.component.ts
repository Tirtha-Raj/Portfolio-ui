import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-loading',
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class]="size">
      <div class="spinner" [style.width.px]="spinnerSize" [style.height.px]="spinnerSize"></div>
      <p class="loading-text" *ngIf="text">{{ text }}</p>
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

      .loading-container.small {
        padding: 1rem;
        gap: 0.5rem;
      }

      .loading-container.large {
        padding: 3rem;
        gap: 1.5rem;
      }

      .spinner {
        border: 3px solid #334155;
        border-top: 3px solid #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .loading-text {
        color: #cbd5e1;
        font-size: 0.95rem;
        margin: 0;
        text-align: center;
      }

      .small .loading-text {
        font-size: 0.85rem;
      }

      .large .loading-text {
        font-size: 1.1rem;
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
  @Input() text = 'Loading...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() spinnerSize = 48;

  ngOnInit() {
    if (this.size === 'small') this.spinnerSize = 24;
    if (this.size === 'large') this.spinnerSize = 64;
  }
}
