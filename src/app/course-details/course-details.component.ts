import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-course-details',
    templateUrl: './course-details.component.html',
    styleUrls: ['./course-details.component.css'],
    standalone: false
})
export class CourseDetailsComponent implements OnInit {
  course: any = {};
  courses: any[] = [];
  stage!: string;
  category!: string;
  courseTitle!: string;
  currentCategory!: string;
  categoryProgress: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);  // Log the params to debug
      this.stage = params['stage'];
      this.category = params['category'];
      this.courseTitle = params['course'];
      this.fetchCoursesInCategory(() => {
        this.fetchCourseDetails();
        this.updateCategoryProgress();
      });
    });

    this.sharedService.currentCategory$.subscribe(category => {
      this.currentCategory = category;
      this.updateCategoryProgress();
    });

    this.sharedService.courses$.subscribe(courses => {
      this.courses = courses;
    });
  }

  fetchCourseDetails(): void {
    this.courseService.getCourse(this.stage, this.category, this.courseTitle).subscribe(course => {
      this.course = course;
      console.log('Fetched course details:', course);
    }, error => {
      console.error('Error fetching course details:', error);
    });
  }

  fetchCoursesInCategory(callback?: Function): void {
    console.log(`Fetching courses for stage: ${this.stage}, category: ${this.category}`);
    this.courseService.getCourses(this.stage, this.category).subscribe(courses => {
      this.courses = courses;
      this.sharedService.setCourses(courses);
      console.log('Fetched courses in category:', courses);
      if (callback) {
        callback();
      }
    }, error => {
      console.error('Error fetching courses in category:', error);
    });
  }

  navigateToNextLesson(): void {
    if (!this.course || !this.courses.length) {
      return;
    }
  
    const currentIndex = this.courses.findIndex(c => c.title === this.courseTitle);
  
    if (currentIndex !== -1) {
      if (currentIndex < this.courses.length - 1) {
        const nextCourse = this.courses[currentIndex + 1];
        const nextUrl = `/courses/${encodeURIComponent(this.stage)}/${encodeURIComponent(this.category)}/${encodeURIComponent(nextCourse.title)}`;
        this.router.navigateByUrl(nextUrl);
      } else {
        // After finishing the last course, navigate back to the main courses page
        this.router.navigateByUrl('/courses');
      }
    } else {
      console.error('Course not found in list, navigating back to courses page.');
      this.router.navigateByUrl('/courses');
    }
  }

 markVideoAsWatched(): void {
  if (this.course && this.course.videoUrl) {
    this.courseService.updateCompletionStatus(this.course._id, this.course.videoUrl).subscribe(
      response => {
        console.log('Video marked as watched:', response);
        this.sharedService.updateCourse(response);
        this.fetchCourseDetails();
        this.updateCategoryProgress();
      },
      error => {
        console.error('Error marking video as watched:', error);
      }
    );
  } else {
    console.error('No course or video URL found to mark as watched');
  }
}

  updateCategoryProgress(): void {
    const categoryCourses = this.courses.filter(course => course.category === this.currentCategory);
    const totalCourses = categoryCourses.length;
    const watchedCourses = categoryCourses.filter(course => course.watchedVideos && course.watchedVideos.length > 0).length;
    this.categoryProgress = totalCourses > 0 ? Math.floor((watchedCourses / totalCourses) * 100) : 0;
  }

  getCompletionPercentage(course: any): string {
    const totalVideos = course.videos ? course.videos.length : 0;
    const watchedVideos = course.watchedVideos ? course.watchedVideos.length : 0;
    return totalVideos > 0 ? `${Math.floor((watchedVideos / totalVideos) * 100)}%` : '0%';
  }

  getCompletionPercentageAsNumber(course: any): number {
    const totalVideos = course.videos ? course.videos.length : 0;
    const watchedVideos = course.watchedVideos ? course.watchedVideos.length : 0;
    return totalVideos > 0 ? Math.floor((watchedVideos / totalVideos) * 100) : 0;
  }
}
