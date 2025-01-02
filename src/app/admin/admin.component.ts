// src/app/admin/admin.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: false
})
export class AdminComponent implements OnInit {
  isExpanded: boolean = false;

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['/admin/products-management']);
  }
}
