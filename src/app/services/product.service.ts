import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?category=${category}`);
  }

  addProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  editProduct(productId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${productId}`, formData);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`);
  }

  // Add this method to increment product count
  incrementProductCount(productId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/increment/${productId}`, {});
  }
  // Add this method to ProductService
getProductWithHighestCount(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/highest-count`);
}

}
