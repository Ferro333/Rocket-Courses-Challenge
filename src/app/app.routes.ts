import { Routes } from '@angular/router';
import { CourseListComponent } from './pages/course-list/course-list.component';
import { CourseFormComponent } from './pages/course-form/course-form.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
export const routes: Routes = [
  { path: '', component: CourseListComponent },
  { path: 'courses/new', component: CourseFormComponent },
  { path: 'courses/:id/edit', component: CourseFormComponent },
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: '**', redirectTo: '' }
];
