import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';

export const PROJECTS_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: ':id', component: ProjectDetailComponent }
];
