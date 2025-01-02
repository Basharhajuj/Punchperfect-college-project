import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router'; // Import Router

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css'],
    standalone: false
})
export class NewsComponent implements OnInit {
  header: any = {};
  articles: any[] = [];
  showPopup: boolean = false;
  highestCountProduct: any = null;

  constructor(
    private newsService: NewsService,
    private productService: ProductService,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.newsService.getNews().subscribe((news) => {
      this.header = news.header;
      this.articles = news.articles;

      // Show the popup after 3 seconds
      setTimeout(() => {
        this.fetchHighestCountProduct();
      }, 3000);
    });
  }

  fetchHighestCountProduct(): void {
    this.productService.getProductWithHighestCount().subscribe((product) => {
      this.highestCountProduct = product;
      this.showPopup = true;
    });
  }

  closePopup(): void {
    this.showPopup = false;
  }

  goToproducts(): void {
    this.router.navigate(['/products']); // Updated navigation path
  }
}
