import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
    standalone: false
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(
      (data: any) => {
        this.cartItems = data.items;
      },
      error => {
        console.error('Error loading cart:', error);
      }
    );
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe(
      () => {
        this.loadCart();
      },
      error => {
        console.error('Error removing item from cart:', error);
        alert('Failed to remove item from cart. Please try again.');
      }
    );
  }

  increaseQuantity(productId: string): void {
    this.cartService.addToCart(productId, 1).subscribe(
      () => {
        this.loadCart();
      },
      error => {
        console.error('Error increasing quantity:', error);
        alert('Failed to increase quantity. Please try again.');
      }
    );
  }

  decreaseQuantity(productId: string): void {
    this.cartService.addToCart(productId, -1).subscribe(
      () => {
        this.loadCart();
      },
      error => {
        console.error('Error decreasing quantity:', error);
        alert('Failed to decrease quantity. Please try again.');
      }
    );
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.productId.price * item.quantity, 0);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
