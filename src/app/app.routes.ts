import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { PROJECTS_ROUTES } from './features/projects/projects.routes';
import { BLOGS_ROUTES } from './features/blogs/blogs.routes';
import { CONTACT_ROUTES } from './features/contact/contact.routes';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { SKILLS_ROUTES } from './features/skills/skills.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', children: PROJECTS_ROUTES },
  { path: 'blogs', children: BLOGS_ROUTES },
  { path: 'skills', children: SKILLS_ROUTES },
  { path: 'contact', children: CONTACT_ROUTES },
  { path: 'login', children: AUTH_ROUTES },
  { path: 'admin', children: ADMIN_ROUTES },
  { path: '**', redirectTo: 'projects' }
];
