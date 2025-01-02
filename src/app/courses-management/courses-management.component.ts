import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';

@Component({
    selector: 'app-courses-management',
    templateUrl: './courses-management.component.html',
    styleUrls: ['./courses-management.component.css'],
    standalone: false
})
export class CoursesManagementComponent implements OnInit {
  stages: string[] = ['Beginner', 'Intermediate', 'Professional'];
  beginnerCategories: string[] = [
    'Learn the Basic Stance and Footwork',
    'Master Basic Punches',
    'Develop Defense Techniques',
    'Build Conditioning and Endurance',
    'Practice Combos and Sparring',
    'Study Boxing Strategy and Techniques'
  ];
  intermediateCategories: string[] = [
    'Refine Technique and Accuracy',
    'Advanced Footwork',
    'Enhanced Defense and Counterpunching',
    'Strength and Conditioning',
    'Strategy and Ring IQ',
    'Mental Toughness and Recovery'
  ];
  professionalCategories: string[] = [
    'Technical Mastery and Innovation',
    'Advanced Conditioning and Peak Performance',
    'In-Depth Strategy and Tactics',
    'Mental and Psychological Training',
    'Professional Sparring and Simulation',
    'Recovery, Nutrition, and Injury Prevention'
  ];
  categories: string[] = this.beginnerCategories;
  selectedStage: string = 'Beginner';
  courses: any[] = [];
  newCourse = {
    _id: '',
    title: '',
    description: '',
    stage: 'Beginner',
    category: '',
    video: null
  };
  isEditing = false;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.courseService.getCourses(this.selectedStage, this.newCourse.category).subscribe(courses => {
      this.courses = courses;
    });
  }

  onStageChange(): void {
    if (this.selectedStage === 'Beginner') {
      this.categories = this.beginnerCategories;
    } else if (this.selectedStage === 'Intermediate') {
      this.categories = this.intermediateCategories;
    } else if (this.selectedStage === 'Professional') {
      this.categories = this.professionalCategories;
    }
    this.newCourse.category = this.categories[0]; // Reset category to the first option
    this.fetchCourses(); // Refresh courses based on the new stage
  }

  onVideoSelected(event: any): void {
    this.newCourse.video = event.target.files[0];
  }

  addCourse(): void {
    const formData = new FormData();
    formData.append('title', this.newCourse.title);
    formData.append('description', this.newCourse.description);
    formData.append('stage', this.newCourse.stage);
    formData.append('category', this.newCourse.category);
    if (this.newCourse.video) {
      formData.append('video', this.newCourse.video);
    }

    this.courseService.addCourse(formData).subscribe(() => {
      this.fetchCourses();
      this.resetForm();
    });
  }

  editCourse(course: any): void {
    this.newCourse = { ...course };
    this.isEditing = true;
  }

  updateCourse(): void {
    const formData = new FormData();
    formData.append('title', this.newCourse.title);
    formData.append('description', this.newCourse.description);
    formData.append('stage', this.newCourse.stage);
    formData.append('category', this.newCourse.category);
    if (this.newCourse.video) {
      formData.append('video', this.newCourse.video);
    }

    this.courseService.updateCourse(this.newCourse._id, formData).subscribe(() => {
      this.fetchCourses();
      this.resetForm();
    });
  }

  resetForm(): void {
    this.newCourse = {
      _id: '',
      title: '',
      description: '',
      stage: 'Beginner',
      category: '',
      video: null
    };
    this.isEditing = false;
  }

  deleteCourse(courseId: string): void {
    this.courseService.deleteCourse(courseId).subscribe(() => {
      this.fetchCourses();
    });
  }
}
