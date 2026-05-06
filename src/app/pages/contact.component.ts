import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService, ContactRequest } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="contact-card">
      <p class="eyebrow">Contact</p>
      <h1>Send a message</h1>
      <p>Reach out with a quick note and I’ll respond as soon as possible.</p>

      <form (ngSubmit)="submit()">
        <label>
          Name
          <input type="text" [(ngModel)]="model.name" name="name" required />
        </label>
        <label>
          Email
          <input type="email" [(ngModel)]="model.email" name="email" required />
        </label>
        <label>
          Message
          <textarea rows="5" [(ngModel)]="model.message" name="message" required></textarea>
        </label>

        <button type="submit">Send message</button>
      </form>

      <p *ngIf="message" class="message success">{{ message }}</p>
      <p *ngIf="error" class="message error">{{ error }}</p>
    </section>
  `,
  styles: [
    '.contact-card { max-width: 620px; margin: 0 auto; padding: 2rem; background: #fff; border-radius: 1rem; box-shadow: 0 18px 40px rgba(15,23,42,.08); }',
    '.eyebrow { margin: 0 0 .4rem; text-transform: uppercase; color: #6366f1; letter-spacing: .2em; font-size: .8rem; }',
    'h1 { margin: .25rem 0 1rem; font-size: 2rem; }',
    'p { margin: 0 0 1.25rem; color: #475569; }',
    'label { display: block; margin-bottom: 1rem; font-weight: 600; color: #334155; }',
    'input, textarea { width: 100%; padding: .85rem 1rem; border: 1px solid #cbd5e1; border-radius: .85rem; margin-top: .5rem; }',
    'button { padding: .95rem 1rem; border: none; border-radius: .85rem; background: #4338ca; color: #fff; font-weight: 700; cursor: pointer; }',
    '.message { margin-top: 1rem; padding: 1rem 1.25rem; border-radius: .75rem; }',
    '.success { background: #ecfdf5; color: #166534; }',
    '.error { background: #fee2e2; color: #991b1b; }'
  ]
})
export class ContactComponent {
  model: ContactRequest = { name: '', email: '', message: '' };
  message = '';
  error = '';

  constructor(private api: ApiService) {}

  submit(): void {
    this.message = '';
    this.error = '';
    this.api.sendContact(this.model).subscribe({
      next: () => {
        this.message = 'Message sent successfully. Thank you!';
        this.model = { name: '', email: '', message: '' };
      },
      error: () => {
        this.error = 'Unable to send message. Please try again later.';
      }
    });
  }
}
