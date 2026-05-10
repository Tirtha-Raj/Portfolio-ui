import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminProjectsComponent } from './pages/projects/projects.component';
import { AdminBlogsComponent } from './pages/blogs/blogs.component';
import { AdminSkillsComponent } from './pages/skills/skills.component';
import { AdminContactMessagesComponent } from './pages/contact-messages/contact-messages.component';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'projects', component: AdminProjectsComponent },
      { path: 'blogs', component: AdminBlogsComponent },
      { path: 'skills', component: AdminSkillsComponent },
      { path: 'contact-messages', component: AdminContactMessagesComponent }
    ]
  }
];
