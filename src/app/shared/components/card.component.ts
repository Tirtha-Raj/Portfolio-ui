import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type CardVariant = 'default' | 'elevated' | 'flat';

@Component({
  standalone: true,
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div [class]="getCardClass()">
      <div class="card-header" *ngIf="title || subtitle">
        <h5 class="card-title mb-0" *ngIf="title">{{ title }}</h5>
        <p class="card-subtitle text-secondary mb-0" *ngIf="subtitle">{{ subtitle }}</p>
      </div>

      <div class="card-body">
        <ng-content></ng-content>
      </div>

      <div class="card-footer border-0" *ngIf="footer">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        border: none;
        border-radius: 0.75rem;
        transition: all 0.3s ease;
        overflow: hidden;
      }

      .card.card-default {
        background-color: #1e293b;
        border: 1px solid #334155;
      }

      .card.card-default:hover {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      .card.card-elevated {
        background-color: #0f172a;
        border: 1px solid #334155;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.3);
      }

      .card.card-elevated:hover {
        box-shadow: 0 15px 40px rgba(99, 102, 241, 0.2);
        border-color: #6366f1;
      }

      .card.card-flat {
        background-color: #1e293b;
        border: none;
      }

      .card.card-flat:hover {
        background-color: #334155;
      }

      .card-header {
        padding: 1.25rem;
        border-bottom: 1px solid #334155;
        background-color: rgba(0, 0, 0, 0.2);
      }

      .card-title {
        font-weight: 600;
        color: #e2e8f0;
        letter-spacing: 0.02em;
      }

      .card-subtitle {
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .card-body {
        padding: 1.25rem;
        color: #cbd5e1;
      }

      .card-footer {
        padding: 1rem 1.25rem;
        background-color: rgba(0, 0, 0, 0.1);
      }
    `
  ]
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() footer = false;
  @Input() variant: CardVariant = 'default';

  getCardClass(): string {
    return `card card-${this.variant}`;
  }
}
