import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit, AfterViewInit {
  imageList: HTMLElement | null = null;
  slideButtons: NodeListOf<HTMLElement> | null = null;
  sliderScrollbar: HTMLElement | null = null;
  maxScrollLeft = 0;
  currentSlideIndex = 0; // Track current slide index
  showPopup = false; // Ensure showPopup is initialized

  constructor(
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    // Initialization logic here if needed
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.imageList = document.querySelector(".slider-wrapper .image-list") as HTMLElement;
      this.slideButtons = document.querySelectorAll(".slider-wrapper .slide-button") as NodeListOf<HTMLElement>;
      this.sliderScrollbar = document.querySelector(".container .slider-scrollbar") as HTMLElement;

      this.initSlider();

      // Delay showing the popup after 3 seconds (3000 milliseconds) if user is not logged in
      if (!this.authService.isLoggedIn()) {
        setTimeout(() => {
          this.showPopup = true;
        }, 3000);
      }
    } 
  }

  initSlider(): void {
    if (this.slideButtons) {
      this.slideButtons.forEach(button => {
        button.addEventListener("click", () => {
          const direction = button.id === "prev-slide" ? -1 : 1;
          this.currentSlideIndex += direction;
          this.showSlide(this.currentSlideIndex);
        });
      });
    }

    const handleSlideButtons = () => {
      if (this.slideButtons && this.imageList) {
        this.slideButtons[0].style.display = this.currentSlideIndex <= 0 ? "none" : "flex";
        this.slideButtons[1].style.display = this.currentSlideIndex >= this.maxScrollLeft ? "none" : "flex";
      }
    };

    if (this.imageList) {
      this.imageList.addEventListener("scroll", () => {
        handleSlideButtons();
      });
    }

    window.addEventListener("load", () => {
      if (this.imageList) {
        this.maxScrollLeft = this.imageList.scrollWidth - this.imageList.clientWidth;
        handleSlideButtons();
      }
    });
  }

  showSlide(index: number): void {
    const scrollAmount = this.imageList!.clientWidth * index;
    if (this.imageList) {
      this.imageList.scroll({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  }

  goToSignInPage(): void {
    this.router.navigate(['/register']);
  }

  closePopup(): void {
    this.showPopup = false;
  }
}
