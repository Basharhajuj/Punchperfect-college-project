// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, { productId, quantity });
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/remove/${productId}`);
  }
}
