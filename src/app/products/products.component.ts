import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
    standalone: false
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: string[] = ['Beginner', 'Intermediate', 'Professional'];
  selectedCategory: string = 'Beginner'; // Default category

  showModal: boolean = false;
  selectedProduct: any = null;
  quantity: number = 1;

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts(this.selectedCategory).subscribe((products: any[]) => {
      this.products = products;
    }, (error: any) => {
      console.error('Error fetching products:', error);
    });
  }

  openModal(product: any): void {
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
    this.quantity = 1;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.selectedProduct) {
      this.cartService.addToCart(this.selectedProduct._id, this.quantity).subscribe(
        response => {
          console.log('Product added to cart:', response);
          // Call the API to increment the count
          this.productService.incrementProductCount(this.selectedProduct._id).subscribe(
            () => {
              console.log('Product count incremented');
            },
            error => {
              console.error('Error incrementing product count:', error);
            }
          );
          this.closeModal(); // Close the modal after adding to cart
        },
        error => {
          console.error('Error adding product to cart:', error);
          alert('Failed to add product to cart. Please try again.');
        }
      );
    }
  }
  
}
