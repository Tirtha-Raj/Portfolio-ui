import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-confirmation-dialog',
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" *ngIf="visible" (click)="onCancel()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3 class="dialog-title">{{ title }}</h3>
          <button class="close-btn" (click)="onCancel()" type="button">×</button>
        </div>

        <div class="dialog-body">
          <p class="dialog-message">{{ message }}</p>
        </div>

        <div class="dialog-footer">
          <button
            class="btn btn-secondary"
            (click)="onCancel()"
            [disabled]="loading"
            type="button"
          >
            {{ cancelText }}
          </button>
          <button
            class="btn btn-primary"
            (click)="onConfirm()"
            [disabled]="loading"
            type="button"
          >
            <span *ngIf="loading" class="spinner"></span>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease-out;
      }

      .dialog {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        max-width: 400px;
        width: 90%;
        max-height: 90vh;
        overflow: hidden;
        animation: slideIn 0.2s ease-out;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 1.5rem 0;
        margin-bottom: 1rem;
      }

      .dialog-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #64748b;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
      }

      .close-btn:hover {
        background: #f1f5f9;
        color: #334155;
      }

      .dialog-body {
        padding: 0 1.5rem;
      }

      .dialog-message {
        margin: 0;
        color: #64748b;
        line-height: 1.6;
      }

      .dialog-footer {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
        padding: 1.5rem;
        margin-top: 1.5rem;
        border-top: 1px solid #e2e8f0;
      }

      .btn {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-primary {
        background: #dc2626;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: #b91c1c;
      }

      .btn-secondary {
        background: #f1f5f9;
        color: #334155;
        border: 1px solid #cbd5e1;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #e2e8f0;
      }

      .spinner {
        width: 1rem;
        height: 1rem;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 480px) {
        .dialog {
          margin: 1rem;
          width: calc(100% - 2rem);
        }

        .dialog-footer {
          flex-direction: column-reverse;
        }

        .btn {
          width: 100%;
          justify-content: center;
        }
      }
    `
  ]
})
export class ConfirmationDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() loading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}