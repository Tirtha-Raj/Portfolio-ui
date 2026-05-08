import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  standalone: true,
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClass()"
      (click)="onClick()"
    >
      <span *ngIf="!loading">{{ label }}</span>
      <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
      <span *ngIf="loading">{{ loadingText }}</span>
    </button>
  `,
  styles: [
    `
      button {
        font-weight: 500;
        letter-spacing: 0.02em;
        transition: all 0.2s ease;
        border: none;
        cursor: pointer;
        white-space: nowrap;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Primary Button */
      .btn-primary {
        background-color: #6366f1;
        color: #fff;
      }

      .btn-primary:hover:not(:disabled) {
        background-color: #4f46e5;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      }

      .btn-primary:active:not(:disabled) {
        transform: translateY(0);
      }

      /* Secondary Button */
      .btn-secondary {
        background-color: #334155;
        color: #e2e8f0;
        border: 1px solid #475569;
      }

      .btn-secondary:hover:not(:disabled) {
        background-color: #475569;
        border-color: #64748b;
      }

      /* Danger Button */
      .btn-danger {
        background-color: #dc2626;
        color: #fff;
      }

      .btn-danger:hover:not(:disabled) {
        background-color: #b91c1c;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
      }

      /* Success Button */
      .btn-success {
        background-color: #16a34a;
        color: #fff;
      }

      .btn-success:hover:not(:disabled) {
        background-color: #15803d;
        box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
      }

      /* Ghost Button */
      .btn-ghost {
        background-color: transparent;
        color: #6366f1;
        border: 1px solid #6366f1;
      }

      .btn-ghost:hover:not(:disabled) {
        background-color: rgba(99, 102, 241, 0.1);
        border-color: #6366f1;
      }

      /* Button Sizes */
      .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        border-radius: 0.5rem;
      }

      .btn-md {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 0.625rem;
      }

      .btn-lg {
        padding: 1rem 2rem;
        font-size: 1.125rem;
        border-radius: 0.75rem;
      }

      /* Full Width */
      .btn-block {
        width: 100%;
      }

      .spinner-border {
        width: 1rem;
        height: 1rem;
        border-width: 0.25em;
      }
    `
  ]
})
export class ButtonComponent {
  @Input() label = 'Button';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() loadingText = 'Loading...';
  @Input() fullWidth = false;
  @Output() clicked = new EventEmitter<void>();
  @HostBinding('class') hostClass = 'btn-wrapper';

  getButtonClass(): string {
    return `btn btn-${this.variant} btn-${this.size} ${this.fullWidth ? 'btn-block' : ''}`;
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
