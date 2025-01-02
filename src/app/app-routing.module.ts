// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { AdminComponent } from './admin/admin.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { ProductsComponent } from './products/products.component';
import { ProductsManagementComponent } from './products-management/products-management.component';
import { CoursesManagementComponent } from './courses-management/courses-management.component';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { NewsManagementComponent } from './news-management/news-management.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { QuizComponent } from './quiz/quiz.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] }, children: [
    { path: 'products-management', component: ProductsManagementComponent },
    { path: 'courses-management', component: CoursesManagementComponent },
    { path: 'news-management', component: NewsManagementComponent }
  ] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'quiz', component: QuizComponent },
  { path: 'courses/:stage/:category/:course', component: CourseDetailsComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent,canActivate: [AuthGuard] },
  { path: 'news', component: NewsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
