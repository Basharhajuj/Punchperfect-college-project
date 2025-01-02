import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service'; // Ensure the correct path

@Component({
    selector: 'app-products-management',
    templateUrl: './products-management.component.html',
    styleUrls: ['./products-management.component.css'],
    standalone: false
})
export class ProductsManagementComponent implements OnInit {
  categories: string[] = ['Beginner', 'Intermediate', 'Professional'];
  selectedCategory: string = 'Beginner';
  products: any[] = [];
  newProduct = {
    name: '',
    price: 0,
    description: '',
    stock: 0,
    category: 'Beginner',
    image: null
  };
  editMode: boolean = false;
  currentProductId: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts(this.selectedCategory).subscribe(products => {
      this.products = products;
    });
  }

  onImageSelected(event: any): void {
    this.newProduct.image = event.target.files[0];
  }

  addProduct(): void {
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('price', this.newProduct.price.toString());
    formData.append('description', this.newProduct.description);
    formData.append('stock', this.newProduct.stock.toString());
    formData.append('category', this.newProduct.category);
    if (this.newProduct.image) {
      formData.append('image', this.newProduct.image);
    }

    if (this.editMode && this.currentProductId) {
      this.productService.editProduct(this.currentProductId, formData).subscribe(() => {
        this.fetchProducts();
        this.resetForm();
      });
    } else {
      this.productService.addProduct(formData).subscribe(() => {
        this.fetchProducts();
        this.resetForm();
      });
    }
  }

  editProduct(product: any): void {
    this.editMode = true;
    this.currentProductId = product._id;
    this.newProduct = { ...product, image: null };
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.fetchProducts();
    });
  }

  resetForm(): void {
    this.editMode = false;
    this.currentProductId = null;
    this.newProduct = {
      name: '',
      price: 0,
      description: '',
      stock: 0,
      category: 'Beginner',
      image: null
    };
  }
}