import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-quiz',
    templateUrl: './quiz.component.html',
    styleUrls: ['./quiz.component.css'],
    standalone: false
})
export class QuizComponent implements OnInit {
  showPopup = true;
  currentStep = 0;
  selectedOption: string | null = null;
  score = 0;
  totalQuestions = 0;
  email = ''; // The email of the user taking the quiz
  quizCompleted = false;

  gifs = [
    { 
      src: 'https://storage.ko-fi.com/cdn/useruploads/display/ec57f4e2-b1aa-43d4-9a6c-dec536ca08a1_1619660453293.gif', 
      options: ['Jab', 'Cross', 'Hook', 'Uppercut'],
      question: 'What punch is demonstrated in this GIF?',
      correctAnswer: 'Cross'
    },
    { 
      src: 'https://i.imgur.com/4d9Aaii.gif', 
      options: ['Cross', 'Hook', 'Uppercut', 'Jab'],
      question: 'Which punch is shown in the image?',
      correctAnswer: 'Uppercut'
    },
    { 
      src: 'https://media1.giphy.com/media/McLreB0q5zg9MC8y1v/200w.gif?cid=6c09b95225dfvzf1b9ddq60r8q291ar1qvscwizcp1hrkd9s&ep=v1_videos_search&rid=200w.gif&ct=v', 
      options: ['Uppercut', 'Jab', 'Cross', 'Hook'],
      question: 'Identify the punch being demonstrated in this GIF.',
      correctAnswer: 'Hook'
    }
  ];

  questions = [
    {
      question: 'What punch is often considered the most important in boxing due to its speed and versatility?',
      options: ['Uppercut', 'Cross', 'Hook', 'Jab'],
      correctAnswer: 'Jab'
    },
    {
      question: 'Which punch is typically the most powerful and is thrown with the rear hand?',
      options: ['Jab', 'Hook', 'Cross', 'Uppercut'],
      correctAnswer: 'Cross'
    },
    {
      question: 'Which punch is delivered with an upward motion and is effective at close range?',
      options: ['Hook', 'Jab', 'Cross', 'Uppercut'],
      correctAnswer: 'Uppercut'
    },
    {
      question: 'What is the primary defensive technique used to avoid punches by moving the head?',
      options: ['Parrying', 'Slipping', 'Blocking', 'Clinching'],
      correctAnswer: 'Slipping'
    },
    {
      question: "Which type of punch is aimed at an opponent's body to weaken their stamina and lower their guard?",
      options: ['Head jab', 'Body shot', 'Uppercut', 'Cross'],
      correctAnswer: 'Body shot'
    },
    {
      question: 'What is the strategy called when a boxer constantly moves and throws punches while avoiding being hit?',
      options: ['Brawling', 'Counterpunching', 'Outboxing', 'Infighting'],
      correctAnswer: 'Outboxing'
    },
    {
      question: 'Which punch is most effective at close range and can be thrown with either hand?',
      options: ['Cross', 'Jab', 'Hook', 'Overhand'],
      correctAnswer: 'Hook'
    },
    {
      question: 'What punch is often used as a knockout punch and is thrown in a looping motion?',
      options: ['Jab', 'Cross', 'Uppercut', 'Overhand'],
      correctAnswer: 'Overhand'
    },
    {
      question: 'Which combination of punches is commonly used to create openings and keep an opponent off-balance?',
      options: ['Jab-Cross', 'Hook-Uppercut', 'Cross-Jab', 'Jab-Uppercut'],
      correctAnswer: 'Jab-Cross'
    },
    {
      question: 'What is the primary purpose of feinting in boxing?',
      options: ['To land a knockout punch', 'To confuse and create openings', 'To defend against punches', 'To increase punching power'],
      correctAnswer: 'To confuse and create openings'
    }
  ];

  introduction = {
    title: 'Test Your Boxing Knowledge',
    description: 'Welcome to the boxing quiz! This quiz will test your knowledge about boxing techniques, covering punches, defensive strategies, footwork, and famous boxers. Whether you\'re a seasoned boxing enthusiast or just getting started, challenge yourself to see how well you know the sweet science. Get ready to identify different punches, understand key tactics, and learn about boxing legends. Let\'s dive in and see how much you know about the sport of boxing!'
  };

  constructor(private http: HttpClient, private router: Router) {
    this.totalQuestions = this.gifs.length + this.questions.length;
  }

  ngOnInit() {
    this.totalQuestions = this.gifs.length + this.questions.length;
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalQuestions - 1) {
      this.currentStep++;
    } else {
      this.quizCompleted = true;
    }
  }

  selectAnswer(option: string, correctAnswer: string): void {
    this.selectedOption = option;

    if (option === correctAnswer) {
      this.score++;
    }

    console.log(`Current Step: ${this.currentStep}, Score: ${this.score}, Selected Option: ${option}, Correct Answer: ${correctAnswer}`);

    if (this.currentStep < this.totalQuestions - 1) {
      this.nextStep();
    } else {
      this.quizCompleted = true;
    }
  }

  saveInfo(): void {
  if (!this.email) {
    alert('Please enter your email before submitting the quiz.');
    return;
  }

  console.log('Quiz score:', this.score);  // Check the score value
  console.log('Email:', this.email);  // Check the email value
  this.http.post('http://localhost:3000/api/quiz', { email: this.email, score: this.score })
    .subscribe({
      next: () => {
        console.log('Quiz submitted successfully');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error submitting quiz:', err);
        console.error('Error details:', err.message);  // Additional error details
      }
    });
}

}
