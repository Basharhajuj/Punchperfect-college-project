import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { JwtModule, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { ProductsComponent } from './products/products.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsManagementComponent } from './products-management/products-management.component';
import { CoursesManagementComponent } from './courses-management/courses-management.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductService } from './services/product.service';
import { CourseService } from './services/course.service';
import { SharedService } from './services/shared.service';
import { NewsService } from './services/news.service';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { FooterComponent } from './footer/footer.component';
import { NewsManagementComponent } from './news-management/news-management.component';
import { ProfileComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { QuizComponent } from './quiz/quiz.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    CoursesComponent,
    CourseDetailsComponent,
    ProductsComponent,
    NavbarComponent,
    ProductsManagementComponent,
    CoursesManagementComponent,
    ProgressBarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NewsComponent,
    NewsManagementComponent,
    FooterComponent,
    ProfileComponent,
    CartComponent,
    QuizComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).token : null
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthService,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    AuthGuard,
    NewsService,
    ProductService,
    CourseService,
    SharedService,
    provideHttpClient(withFetch())
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
