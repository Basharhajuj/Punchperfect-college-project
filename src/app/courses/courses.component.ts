import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';

interface Category {
  name: string;
  description: string;
  image: string;
  progress: number;
  courses: any[];
  isLocked?: boolean;  // New property to track if the category is locked
}

interface Stage {
  name: string;
  categories: Category[];
}

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css'],
    standalone: false
})
export class CoursesComponent implements OnInit {
  stages: Stage[] = [
    {
      name: 'Beginner',
      categories: [
        { name: 'Learn the Basic Stance and Footwork', description: 'Begin your journey', image: 'assets/beginnerC/b1.webp', progress: 0, courses: [] },
        { name: 'Master Basic Punches techniques', description: 'Learn the fundamentals', image: 'assets/beginnerC/b2.webp', progress: 0, courses: [] },
        { name: 'Develop rockie Defense Techniques', description: 'Protect yourself', image: 'assets/beginnerC/b3.webp', progress: 0, courses: [] },
        { name: 'Build Conditioning and Endurance', description: 'Get in shape', image: 'assets/beginnerC/b4.webp', progress: 0, courses: [] },
        { name: 'Practice Combos and Sparring', description: 'Apply your skills', image: 'assets/beginnerC/b5.webp', progress: 0, courses: [] },
        { name: 'Study Boxing Strategy and Techniques', description: 'Become strategic', image: 'assets/beginnerC/b6.webp', progress: 0, courses: [] },
      ]
    },
    {
      name: 'Intermediate',
      categories: [
        { name: 'Refine Technique and Accuracy', description: 'Sharpen your skills', image: 'assets/intermediateC/i1.webp', progress: 0, courses: [] },
        { name: 'Advanced Footwork Movement Patterns', description: 'Improve your movement', image: 'assets/intermediateC/i2.webp', progress: 0, courses: [] },
        { name: 'Enhanced Defense and Counterpunching', description: 'Defend and counter', image: 'assets/intermediateC/i3.webp', progress: 0, courses: [] },
        { name: 'Strength and Conditioning Fundamentals Guide', description: 'Increase your strength', image: 'assets/intermediateC/i4.webp', progress: 0, courses: [] },
        { name: 'Strategy and Ring IQ Improvement Course', description: 'Outsmart your opponent', image: 'assets/intermediateC/i5.webp', progress: 0, courses: [] },
        { name: 'Mental Toughness and Recovery', description: 'Build resilience', image: 'assets/intermediateC/i6.webp', progress: 0, courses: [] },
      ]
    },
    {
      name: 'Professional',
      categories: [
        { name: 'Technical Mastery and Innovation', description: 'Master your craft', image: 'assets/professionalC/p1.webp', progress: 0, courses: [] },
        { name: 'Advanced Conditioning and Peak Performance', description: 'Reach your peak', image: 'assets/professionalC/p2.webp', progress: 0, courses: [] },
        { name: 'In-Depth Strategy and Tactics Analysis', description: 'Advanced strategies', image: 'assets/professionalC/p3.webp', progress: 0, courses: [] },
        { name: 'Mental and Psychological Training', description: 'Mental fortitude', image: 'assets/professionalC/p4.webp', progress: 0, courses: [] },
        { name: 'Professional Sparring and Simulation', description: 'Simulate real fights', image: 'assets/professionalC/p5.webp', progress: 0, courses: [] },
        { name: 'Recovery, Nutrition, and Injury Prevention', description: 'Stay healthy', image: 'assets/professionalC/p6.webp', progress: 0, courses: [] },
      ]
    }
  ];

  filteredStages: Stage[] = [];

  constructor(
    private courseService: CourseService, 
    private router: Router,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    console.log('Current user:', currentUser); // Debug log
  
    if (currentUser && currentUser.skillLevel) {
      const skillLevel = currentUser.skillLevel;
      this.processStages(skillLevel);
      this.sharedService.courses$.subscribe(courses => {
        this.updateStages(courses);
      });
      this.fetchAllCourses(skillLevel);
    } else {
      console.error('Skill level is not defined for the current user');
    }
  }
  isLocked(stageName: string): boolean {
    const skillLevel = this.authService.currentUserValue?.skillLevel.toLowerCase();
    if (!skillLevel) {
      return true; // Default to locked if skillLevel is not available
    }
  
    switch (skillLevel) {
      case 'beginner':
        return stageName.toLowerCase() !== 'beginner';
      case 'intermediate':
        return stageName.toLowerCase() === 'professional';
      case 'professional':
        return false;
      default:
        return true;
    }
  }
  
  processStages(skillLevel: string): void {
    this.stages.forEach(stage => {
      stage.categories.forEach(category => {
        category.isLocked = stage.name.toLowerCase() !== skillLevel.toLowerCase();
      });
    });
  }

  filterStagesBySkillLevel(skillLevel: string): void {
    this.filteredStages = this.stages.map(stage => {
      const newCategories = stage.categories.map(category => {
        const courses = category.courses.map(course => {
          // Lock the course if it doesn't match the user's skill level
          const isLocked = stage.name.toLowerCase() !== skillLevel.toLowerCase();
          return { ...course, locked: isLocked };
        });
        return { ...category, courses };
      });
      return { ...stage, categories: newCategories };
    });
  }
  

  fetchAllCourses(skillLevel: string): void {
  this.stages.forEach(stage => {
    stage.categories.forEach(category => {
      this.courseService.getCourses(skillLevel.toLowerCase(), category.name).subscribe(courses => {
        category.courses = courses;
        category.progress = this.getCompletionPercentageAsNumber(category);
      });
    });
  });
}
  
  updateStages(courses: any[]): void {
    this.filteredStages.forEach(stage => {
      stage.categories.forEach(category => {
        category.courses = courses.filter(course => course.category === category.name);
        category.progress = this.getCompletionPercentageAsNumber(category);
      });
    });
  }

  viewCategory(stage: string, category: string): void {
    this.courseService.getCourses(stage.toLowerCase(), category).subscribe(courses => {
      if (courses && courses.length > 0) {
        const firstCourse = courses[0];
        this.router.navigate(['/courses', stage.toLowerCase(), category, firstCourse.title]);
        this.sharedService.setCurrentCategory(category); // Set the current category
      } else {
        console.error('No courses found for this category.');
      }
    }, error => {
      console.error('Error fetching courses:', error);
    });
  }

  getCompletionPercentage(category: any): string {
    const totalCourses = category.courses ? category.courses.length : 0;
    const watchedCourses = category.courses ? category.courses.filter((course: any) => course.watchedVideos && course.watchedVideos.length > 0).length : 0;
    return totalCourses > 0 ? `${Math.floor((watchedCourses / totalCourses) * 100)}%` : '0%';
  }
  
    getStageCompletionPercentage(stage: any): number {
  const totalCategories = stage.categories.length;
  if (totalCategories === 0) {
    return 0; // Avoid division by zero
  }

  const totalPercentage = stage.categories.reduce((sum: number, category: any) => {
    return sum + this.getCompletionPercentageAsNumber(category);
  }, 0);

  return Math.floor(totalPercentage / totalCategories);
}

   
  

  getCompletionPercentageAsNumber(category: any): number {
    const totalCourses = category.courses ? category.courses.length : 0;
    const watchedCourses = category.courses ? category.courses.filter((course: any) => course.watchedVideos && course.watchedVideos.length > 0).length : 0;
    return totalCourses > 0 ? Math.floor((watchedCourses / totalCourses) * 100) : 0;
  }
}
