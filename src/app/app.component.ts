import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AuthService } from './core/services/auth.service';
import { AnalyticsService } from './core/services/analytics.service';
import { FooterComponent } from './shared/components/footer.component';
import { NavbarComponent } from './shared/components/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    public auth: AuthService,
    private router: Router,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    // Track page visits on navigation
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        const pageName = this.getPageName(event.urlAfterRedirects);
        this.analytics.trackPageVisit(pageName);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getPageName(url: string): string {
    // Extract page name from URL
    const segments = url.split('/').filter((s) => s);
    if (segments.length === 0) return 'home';
    return segments[0];
  }

  logout(): void {
    this.auth.logout();
  }
}
