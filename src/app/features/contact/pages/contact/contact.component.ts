import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContactApiService } from '../../../../data/api/contact.api';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Header -->
    <div class="contact-header">
      <div class="header-content">
        <p class="eyebrow">Contact</p>
        <h1>Get in Touch</h1>
        <p class="subtitle">Have a question or want to collaborate? I'd love to hear from you.</p>
      </div>
    </div>

    <!-- Success Message -->
    <div *ngIf="successMessage" class="alert alert-success" role="alert">
      <span class="icon">✓</span>
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
      <span class="icon">✕</span>
      {{ errorMessage }}
    </div>

    <!-- Contact Form -->
    <div class="contact-container">
      <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
        <!-- Name Field -->
        <div class="form-group">
          <label for="name" class="form-label">Full Name</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="form-control"
            placeholder="John Doe"
            [class.is-invalid]="isFieldInvalid('name')"
          />
          <span *ngIf="isFieldInvalid('name')" class="form-error">
            <span *ngIf="contactForm.get('name')?.hasError('required')">Name is required</span>
            <span *ngIf="contactForm.get('name')?.hasError('minlength')">Name must be at least 2 characters</span>
          </span>
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="form-control"
            placeholder="you@example.com"
            [class.is-invalid]="isFieldInvalid('email')"
          />
          <span *ngIf="isFieldInvalid('email')" class="form-error">
            <span *ngIf="contactForm.get('email')?.hasError('required')">Email is required</span>
            <span *ngIf="contactForm.get('email')?.hasError('email')">Please enter a valid email address</span>
          </span>
        </div>

        <!-- Subject Field -->
        <div class="form-group">
          <label for="subject" class="form-label">Subject</label>
          <input
            id="subject"
            type="text"
            formControlName="subject"
            class="form-control"
            placeholder="What is this about?"
            [class.is-invalid]="isFieldInvalid('subject')"
          />
          <span *ngIf="isFieldInvalid('subject')" class="form-error">
            <span *ngIf="contactForm.get('subject')?.hasError('required')">Subject is required</span>
            <span *ngIf="contactForm.get('subject')?.hasError('minlength')">Subject must be at least 5 characters</span>
          </span>
        </div>

        <!-- Message Field -->
        <div class="form-group">
          <label for="message" class="form-label">Message</label>
          <textarea
            id="message"
            formControlName="message"
            class="form-control form-textarea"
            placeholder="Tell me more..."
            rows="6"
            [class.is-invalid]="isFieldInvalid('message')"
          ></textarea>
          <span *ngIf="isFieldInvalid('message')" class="form-error">
            <span *ngIf="contactForm.get('message')?.hasError('required')">Message is required</span>
            <span *ngIf="contactForm.get('message')?.hasError('minlength')">Message must be at least 10 characters</span>
          </span>
          <span class="char-count">
            {{ (contactForm.get('message')?.value || '').length }} / 1000 characters
          </span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-submit"
          [disabled]="isSubmitting || !contactForm.valid"
        >
          <span *ngIf="!isSubmitting" class="btn-text">Send Message</span>
          <span *ngIf="isSubmitting" class="btn-loading">
            <span class="spinner"></span>
            Sending...
          </span>
        </button>

        <p class="form-note">
          I typically respond within 24-48 hours. Thank you for reaching out!
        </p>
      </form>

      <!-- Info Sidebar -->
      <div class="contact-info">
        <div class="info-card">
          <h3>Response Time</h3>
          <p>24-48 hours</p>
        </div>

        <div class="info-card">
          <h3>Availability</h3>
          <p>Weekdays, 9 AM - 6 PM UTC</p>
        </div>

        <div class="info-card">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="mailto:contact@example.com">Email</a></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .contact-header {
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(138, 180, 248, 0.12);
      }

      .header-content {
        margin-bottom: 1rem;
      }

      .eyebrow {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.3em;
        color: var(--primary);
        margin: 0 0 0.5rem;
        font-weight: 700;
      }

      h1 {
        margin: 0 0 0.75rem;
        font-size: 3rem;
        font-weight: 800;
        line-height: 1.2;
        color: var(--text);
        letter-spacing: -0.02em;
      }

      .subtitle {
        color: var(--muted);
        font-size: 1.1rem;
        margin: 0;
        line-height: 1.6;
      }

      /* Alert Messages */
      .alert {
        padding: 1.25rem 1.5rem;
        border-radius: 0.85rem;
        border: 1px solid;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideDown 0.3s ease-in;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .alert-success {
        background: rgba(16, 185, 129, 0.12);
        border-color: rgba(16, 185, 129, 0.3);
        color: #a7f3d0;
      }

      .alert-danger {
        background: rgba(248, 113, 113, 0.12);
        border-color: rgba(248, 113, 113, 0.3);
        color: #fecaca;
      }

      .icon {
        font-weight: bold;
        font-size: 1.2rem;
      }

      /* Contact Container */
      .contact-container {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 2rem;
        margin-bottom: 2rem;
      }

      /* Contact Form */
      .contact-form {
        background: rgba(11, 18, 33, 0.6);
        border: 1px solid rgba(138, 180, 248, 0.12);
        border-radius: 1rem;
        padding: 2rem;
      }

      .form-group {
        margin-bottom: 1.75rem;
      }

      .form-label {
        display: block;
        margin-bottom: 0.6rem;
        color: var(--text);
        font-weight: 700;
        font-size: 0.95rem;
      }

      .form-control {
        width: 100%;
        padding: 0.95rem 1rem;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.24);
        border-radius: 0.85rem;
        color: var(--text);
        font-size: 1rem;
        transition: all 0.2s ease;
      }

      .form-control:focus {
        outline: none;
        border-color: var(--primary);
        background: rgba(15, 23, 42, 0.9);
        box-shadow: 0 0 0 3px rgba(138, 180, 248, 0.12);
      }

      .form-control::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .form-control.is-invalid {
        border-color: var(--danger);
        background: rgba(248, 113, 113, 0.05);
      }

      .form-control.is-invalid:focus {
        border-color: var(--danger);
        box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.12);
      }

      .form-textarea {
        resize: vertical;
        min-height: 160px;
        font-family: inherit;
      }

      .form-error {
        display: block;
        color: #fecaca;
        font-size: 0.85rem;
        margin-top: 0.4rem;
      }

      .char-count {
        display: block;
        color: var(--muted);
        font-size: 0.8rem;
        margin-top: 0.4rem;
        text-align: right;
      }

      /* Submit Button */
      .btn {
        padding: 0.95rem 2rem;
        border: none;
        border-radius: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-submit {
        background: var(--primary);
        color: #050b14;
        width: 100%;
        justify-content: center;
      }

      .btn-submit:hover:not(:disabled) {
        background: #c7d2fe;
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(138, 180, 248, 0.2);
      }

      .btn-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-text {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
      }

      .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(5, 11, 20, 0.3);
        border-top-color: #050b14;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .form-note {
        color: var(--muted);
        font-size: 0.9rem;
        margin-top: 1.5rem;
        text-align: center;
      }

      /* Contact Info Sidebar */
      .contact-info {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .info-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(138, 180, 248, 0.12);
        border-radius: 1rem;
        padding: 1.5rem;
        transition: all 0.2s ease;
      }

      .info-card:hover {
        border-color: var(--primary);
        background: rgba(15, 23, 42, 0.9);
      }

      .info-card h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
        color: var(--text);
        font-weight: 700;
      }

      .info-card p {
        margin: 0;
        color: var(--muted);
        font-size: 0.9rem;
      }

      .info-card ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .info-card li {
        margin-bottom: 0.6rem;
      }

      .info-card a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s ease;
      }

      .info-card a:hover {
        color: #bfdbfe;
      }

      /* Responsive */
      @media (max-width: 768px) {
        h1 {
          font-size: 2rem;
        }

        .contact-container {
          grid-template-columns: 1fr;
        }

        .contact-form {
          padding: 1.75rem;
        }

        .contact-info {
          flex-direction: row;
          flex-wrap: wrap;
        }

        .info-card {
          flex: 1;
          min-width: 150px;
        }
      }
    `
  ]
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private contactApi: ContactApiService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Form is already initialized in constructor
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.contactForm.valid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    this.isSubmitting = true;

    const formData = this.contactForm.value;
    const contactRequest = {
      name: formData.name,
      email: formData.email,
      message: `Subject: ${formData.subject}\n\n${formData.message}`
    };

    this.contactApi
      .send(contactRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Your message has been sent successfully! I\'ll get back to you soon.';
          this.contactForm.reset();
          this.isSubmitting = false;

          // Clear success message after 5 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.status === 400) {
            this.errorMessage = 'Invalid form data. Please check your entries.';
          } else if (error.status === 429) {
            this.errorMessage = 'Too many requests. Please wait before sending another message.';
          } else {
            this.errorMessage = 'Unable to send your message. Please try again later.';
          }
        }
      });
  }
}
