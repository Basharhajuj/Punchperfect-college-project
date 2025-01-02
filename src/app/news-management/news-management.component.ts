import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NewsService } from '../services/news.service';

@Component({
    selector: 'app-news-management',
    templateUrl: './news-management.component.html',
    styleUrls: ['./news-management.component.css'],
    standalone: false
})
export class NewsManagementComponent implements OnInit {
  headerForm: FormGroup;
  articleForms: FormGroup[] = [];
  isEditingHeader = false;
  isEditingArticle: number | null = null;
  header: any = {};
  articles: any[] = [];
  message: string = ''; // For success/error messages

  constructor(private fb: FormBuilder, private newsService: NewsService) {
    this.headerForm = this.fb.group({
      title: [''],
      description: [''],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.newsService.getNews().subscribe((news) => {
      this.header = news.header;
      this.headerForm.patchValue(this.header);
      this.articles = news.articles;
      this.articles.forEach((article: any, index: number) => {
        this.articleForms[index] = this.fb.group({
          imageUrl: [article.imageUrl],
          title: [article.title],
          description: [article.description],
          cardLink: [article.cardLink]
        });
      });
    });
  }

  saveHeader() {
    console.log('Header Data:', this.headerForm.value); // Log the form value
    this.newsService.updateNews({ header: this.headerForm.value }).subscribe(() => {
      this.isEditingHeader = false;
      this.message = 'Header updated successfully'; // Success message
      console.log('Header updated successfully');
    }, (error) => {
      this.message = 'Error updating header'; // Error message
      console.error('Error updating header:', error);
    });
  }

  cancelEditHeader() {
    this.isEditingHeader = false;
    this.headerForm.patchValue(this.header); // Reset the form to original values
  }

  saveArticle(index: number) {
    const updatedArticle = this.articleForms[index].value;
    this.articles[index] = updatedArticle;

    console.log('Article Data:', updatedArticle); // Log the form value

    this.newsService.updateNews({ articles: this.articles }).subscribe(() => {
      this.isEditingArticle = null;
      this.message = 'Article updated successfully'; // Success message
      console.log('Article updated successfully');
    }, (error) => {
      this.message = 'Error updating article'; // Error message
      console.error('Error updating article:', error);
    });
  }

  editArticle(index: number) {
    this.isEditingArticle = index;
  }

  cancelEditArticle(index: number) {
    this.isEditingArticle = null;
    this.articleForms[index].patchValue(this.articles[index]);
  }
  
}
