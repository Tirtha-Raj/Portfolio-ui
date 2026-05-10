import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-error-message',
  imports: [CommonModule],
  template: `
    <div class="error-container" [class]="type">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <h4 class="error-title" *ngIf="title">{{ title }}</h4>
        <p class="error-message">{{ message }}</p>
        <button
          *ngIf="retryable"
          class="retry-btn"
          (click)="onRetry.emit()"
          type="button"
        >
          Try Again
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .error-container {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid;
        background: white;
      }

      .error-container.error {
        border-color: #fca5a5;
        background: #fef2f2;
      }

      .error-container.warning {
        border-color: #fcd34d;
        background: #fffbeb;
      }

      .error-container.info {
        border-color: #93c5fd;
        background: #eff6ff;
      }

      .error-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .error-content {
        flex: 1;
      }

      .error-title {
        margin: 0 0 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
      }

      .error-message {
        margin: 0 0 1rem;
        color: #64748b;
        line-height: 1.5;
      }

      .retry-btn {
        background: #dc2626;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .retry-btn:hover {
        background: #b91c1c;
      }

      .warning .retry-btn {
        background: #d97706;
      }

      .warning .retry-btn:hover {
        background: #b45309;
      }

      .info .retry-btn {
        background: #2563eb;
      }

      .info .retry-btn:hover {
        background: #1d4ed8;
      }

      @media (max-width: 768px) {
        .error-container {
          flex-direction: column;
          text-align: center;
        }

        .error-icon {
          align-self: center;
        }
      }
    `
  ]
})
export class ErrorMessageComponent {
  @Input() title = 'Error';
  @Input() message = 'Something went wrong. Please try again.';
  @Input() type: 'error' | 'warning' | 'info' = 'error';
  @Input() retryable = false;
  @Input() onRetry = new EventEmitter<void>();
}