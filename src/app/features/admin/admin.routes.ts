import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent, canActivate: [adminGuard] },
  // Future routes:
  // { path: 'projects', component: AdminProjectsComponent, canActivate: [adminGuard] },
  // { path: 'blogs', component: AdminBlogsComponent, canActivate: [adminGuard] },
  // { path: 'skills', component: AdminSkillsComponent, canActivate: [adminGuard] },
  // { path: 'analytics', component: AdminAnalyticsComponent, canActivate: [adminGuard] },
  // { path: 'contact-messages', component: AdminContactMessagesComponent, canActivate: [adminGuard] }
];
