import { Injectable } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

import { AnalyticsApiService } from '../../data/api/analytics.api';

export type EventType = 'PAGE_VISIT' | 'PROJECT_VIEW' | 'PROJECT_LIKE' | 'PROJECT_UNLIKE' | 'SEARCH' | 'LOGIN' | 'SIGNUP';

interface QueuedEvent {
  eventType: EventType;
  pageName: string;
  projectId?: number;
  searchQuery?: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private eventQueue$ = new Subject<QueuedEvent>();
  private recentEvents: Map<string, number> = new Map();
  private readonly DUPLICATE_PREVENTION_MS = 5000; // 5 seconds
  private readonly EVENT_QUEUE_DEBOUNCE_MS = 1000; // 1 second

  constructor(private analyticsApi: AnalyticsApiService) {
    this.initializeEventQueue();
  }

  private initializeEventQueue(): void {
    // Batch events with debounce to prevent overwhelming the backend
    this.eventQueue$
      .pipe(debounceTime(this.EVENT_QUEUE_DEBOUNCE_MS))
      .subscribe((event) => {
        this.sendEvent(event);
      });
  }

  /**
   * Track a page visit
   */
  trackPageVisit(pageName: string): void {
    this.trackEvent('PAGE_VISIT', pageName);
  }

  /**
   * Track a project view
   */
  trackProjectView(projectId: number, projectTitle: string): void {
    this.trackEvent('PROJECT_VIEW', `projects/${projectTitle}`, projectId);
  }

  /**
   * Track a project like
   */
  trackProjectLike(projectId: number, projectTitle: string): void {
    this.trackEvent('PROJECT_LIKE', `projects/${projectTitle}`, projectId);
  }

  /**
   * Track a project unlike
   */
  trackProjectUnlike(projectId: number, projectTitle: string): void {
    this.trackEvent('PROJECT_UNLIKE', `projects/${projectTitle}`, projectId);
  }

  /**
   * Track a search query
   */
  trackSearch(query: string): void {
    this.trackEvent('SEARCH', 'projects/search', undefined, query);
  }

  /**
   * Track login
   */
  trackLogin(): void {
    this.trackEvent('LOGIN', 'login');
  }

  /**
   * Track signup
   */
  trackSignup(): void {
    this.trackEvent('SIGNUP', 'signup');
  }

  /**
   * Generic event tracking with duplicate prevention
   */
  private trackEvent(eventType: EventType, pageName: string, projectId?: number, searchQuery?: string): void {
    const eventKey = this.generateEventKey(eventType, pageName, projectId, searchQuery);
    const now = Date.now();

    // Check for duplicate events within DUPLICATE_PREVENTION_MS window
    const lastEventTime = this.recentEvents.get(eventKey);
    if (lastEventTime && now - lastEventTime < this.DUPLICATE_PREVENTION_MS) {
      return; // Skip duplicate event
    }

    // Update last event time
    this.recentEvents.set(eventKey, now);

    // Queue event for sending
    const event: QueuedEvent = {
      eventType,
      pageName,
      projectId,
      searchQuery,
      timestamp: now
    };

    this.eventQueue$.next(event);

    // Clean up old entries to prevent memory leak
    this.cleanupOldEvents();
  }

  private sendEvent(event: QueuedEvent): void {
    this.analyticsApi
      .trackEvent(event.eventType, event.pageName, event.projectId, event.searchQuery)
      .subscribe({
        error: (error) => {
          // Silently fail - analytics shouldn't break user experience
          console.debug('Analytics event failed:', error);
        }
      });
  }

  private generateEventKey(
    eventType: EventType,
    pageName: string,
    projectId?: number,
    searchQuery?: string
  ): string {
    const parts = [eventType, pageName];
    if (projectId) parts.push(`project-${projectId}`);
    if (searchQuery) parts.push(`search-${searchQuery}`);
    return parts.join(':');
  }

  private cleanupOldEvents(): void {
    const now = Date.now();
    const threshold = now - this.DUPLICATE_PREVENTION_MS * 2;

    for (const [key, timestamp] of this.recentEvents.entries()) {
      if (timestamp < threshold) {
        this.recentEvents.delete(key);
      }
    }
  }
}
