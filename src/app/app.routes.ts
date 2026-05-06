import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { ProjectDetailComponent } from './pages/project-detail.component';
import { BlogListComponent } from './pages/blog-list.component';
import { BlogDetailComponent } from './pages/blog-detail.component';
import { ContactComponent } from './pages/contact.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { LoginComponent } from './pages/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'blogs', component: BlogListComponent },
  { path: 'blogs/:id', component: BlogDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
