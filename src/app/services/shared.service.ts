import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private coursesSource = new BehaviorSubject<any[]>([]);
  courses$ = this.coursesSource.asObservable();

  private currentCategorySource = new BehaviorSubject<string>(typeof window !== 'undefined' ? localStorage.getItem('currentCategory') || '' : '');
  currentCategory$ = this.currentCategorySource.asObservable();

  setCourses(courses: any[]): void {
    this.coursesSource.next(courses);
  }

  setCurrentCategory(category: string): void {
    this.currentCategorySource.next(category);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentCategory', category);
    }
  }

  updateCourse(updatedCourse: any): void {
    const courses = this.coursesSource.getValue();
    const index = courses.findIndex(course => course._id === updatedCourse._id);
    if (index !== -1) {
      courses[index] = updatedCourse;
      this.coursesSource.next(courses);
    }
  }
}
