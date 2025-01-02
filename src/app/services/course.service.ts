// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient, private authService: AuthService, private sharedService: SharedService) { }

 getCourses(stage: string, category: string): Observable<any[]> {
  const encodedCategory = encodeURIComponent(category);
  const url = `${this.apiUrl}?category=${encodedCategory}`;
  return this.http.get<any[]>(url);
}


  getCourse(stage: string, category: string, title: string): Observable<any> {
    const encodedCategory = encodeURIComponent(category);
    const encodedTitle = encodeURIComponent(title);
    return this.http.get<any>(`${this.apiUrl}/${encodeURIComponent(stage)}/${encodedCategory}/${encodedTitle}`);
  }

  addCourse(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${courseId}`);
  }

  updateCourse(courseId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${courseId}`, formData);
  }

  updateCompletionStatus(courseId: string, videoUrl: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${courseId}/completion`, { videoUrl });
  }

  refreshCourses(stage: string, category: string): void {
    this.getCourses(stage, category).subscribe(courses => {
      this.sharedService.setCourses(courses);
    });
  }

  getUserCourses(): Observable<any[]> {
    const studentId = this.authService.currentUserValue?.id;
    if (!studentId) {
      throw new Error('No student ID found');
    }
    const url = `${this.apiUrl}/user/${studentId}`;
    return this.http.get<any[]>(url);
  }
}
