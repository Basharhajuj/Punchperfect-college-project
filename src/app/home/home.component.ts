import { Component, OnInit,ViewChild,ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements  AfterViewInit {
  imageList: HTMLElement | null = null;
  slideButtons: NodeListOf<HTMLElement> | null = null;
  sliderScrollbar: HTMLElement | null = null;
  maxScrollLeft = 0;
  currentSlideIndex = 0;
  showPopup = false;
  @ViewChild('swiperRef') swiperRef!: ElementRef;

  constructor(
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService // Inject AuthService
  ) {}

  public teamConfig: SwiperOptions = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    spaceBetween: 20,
    coverflowEffect: {
      rotate: 0,
      stretch: 50,
      depth: 100,
      modifier: 0.6,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      1024: { slidesPerView: 3, spaceBetween: 30 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      0: { slidesPerView: 1, spaceBetween: 10 },
    },
  };
  teamMembers = [
    { name: 'BOXING GLOVES', role: '', imageUrl: 'https://cdn.shopify.com/s/files/1/0809/0206/2384/files/P00001663.jpg?v=1715110131&width=500', detailsVisible: false },
    { name: 'BOXING SHOES T', role: '', imageUrl: 'https://cdn.shopify.com/s/files/1/0809/0206/2384/files/eliteshoes_blackgold_1_1_1.jpg?v=1702973090&width=500', detailsVisible: false },
    { name: 'BOXING SHOES S', role: '', imageUrl: 'https://cdn.shopify.com/s/files/1/0809/0206/2384/files/elite_black_1__2.jpg?v=1702970565&width=500', detailsVisible: false },
    { name: 'BOXING SHOES M', role: '', imageUrl: 'https://cdn.shopify.com/s/files/1/0809/0206/2384/files/pivt_black_1.jpg?v=1702970662&width=500', detailsVisible: false },
    { name: 'HEAD GEAR', role: '', imageUrl: 'https://cdn.shopify.com/s/files/1/0809/0206/2384/files/p00001211_1.jpg?v=1702970819&width=500', detailsVisible: false },
  ];

  ngAfterViewInit(): void {
    if (this.swiperRef) {
      new Swiper(this.swiperRef.nativeElement, this.teamConfig);
    }

  }

 

  goToSignInPage(): void {
    this.router.navigate(['/register']);
  }

  closePopup(): void {
    this.showPopup = false;
  }

  toggleBlur(member: any) {
    member.detailsVisible = !member.detailsVisible;
  }
}
