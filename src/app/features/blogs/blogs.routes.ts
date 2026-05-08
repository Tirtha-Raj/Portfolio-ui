import { Routes } from '@angular/router';
import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';

export const BLOGS_ROUTES: Routes = [
  { path: '', component: BlogListComponent },
  { path: ':id', component: BlogDetailComponent }
];
