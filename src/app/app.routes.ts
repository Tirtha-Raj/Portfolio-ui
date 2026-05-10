import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.routes').then(m => m.PROJECTS_ROUTES)
  },
  {
    path: 'blogs',
    loadChildren: () => import('./features/blogs/blogs.routes').then(m => m.BLOGS_ROUTES)
  },
  {
    path: 'skills',
    loadChildren: () => import('./features/skills/skills.routes').then(m => m.SKILLS_ROUTES)
  },
  {
    path: 'contact',
    loadChildren: () => import('./features/contact/contact.routes').then(m => m.CONTACT_ROUTES)
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: '**', redirectTo: 'projects' }
];
