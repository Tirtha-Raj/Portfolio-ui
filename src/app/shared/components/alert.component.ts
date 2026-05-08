import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type AlertVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  standalone: true,
  selector: 'app-alert',
  imports: [CommonModule],
  template: `
    <div [class]="getAlertClass()" role="alert">
      <div class="alert-icon">
        <i [class]="getIconClass()"></i>
      </div>
      <div class="alert-content">
        <strong *ngIf="title">{{ title }}</strong>
        <p class="mb-0" [class.mt-1]="title">{{ message }}</p>
      </div>
      <button
        *ngIf="dismissible"
        type="button"
        class="btn-close btn-close-custom"
        (click)="onDismiss()"
        aria-label="Close"
      ></button>
    </div>
  `,
  styles: [
    `
      .alert {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.25rem;
        border-radius: 0.625rem;
        border-left: 4px solid;
        align-items: flex-start;
      }

      .alert-icon {
        flex-shrink: 0;
        font-size: 1.25rem;
        margin-top: 0.125rem;
      }

      .alert-content {
        flex: 1;
        min-width: 0;
      }

      .alert-content p {
        font-size: 0.95rem;
        line-height: 1.5;
      }

      .btn-close-custom {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1.5rem;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .btn-close-custom:hover {
        opacity: 1;
      }

      /* Variants */
      .alert-primary {
        background-color: rgba(99, 102, 241, 0.1);
        border-color: #6366f1;
        color: #818cf8;
      }

      .alert-success {
        background-color: rgba(22, 163, 74, 0.1);
        border-color: #16a34a;
        color: #86efac;
      }

      .alert-warning {
        background-color: rgba(217, 119, 6, 0.1);
        border-color: #d97706;
        color: #fbbf24;
      }

      .alert-danger {
        background-color: rgba(220, 38, 38, 0.1);
        border-color: #dc2626;
        color: #f87171;
      }

      .alert-info {
        background-color: rgba(59, 130, 246, 0.1);
        border-color: #3b82f6;
        color: #93c5fd;
      }
    `
  ]
})
export class AlertComponent {
  @Input() message = '';
  @Input() title = '';
  @Input() variant: AlertVariant = 'primary';
  @Input() dismissible = true;

  getAlertClass(): string {
    return `alert alert-${this.variant}`;
  }

  getIconClass(): string {
    const icons: Record<AlertVariant, string> = {
      primary: 'ℹ',
      success: '✓',
      warning: '⚠',
      danger: '✕',
      info: 'ℹ'
    };
    return icons[this.variant];
  }

  onDismiss(): void {
    // Component will be removed by parent
  }
}
