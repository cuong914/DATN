import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';

import { HeaderComponent } from '../header/header.component';
import { OrderComponent } from '../order/order.component';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';
import { NgIf,NgFor,NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,FormsModule,NgClass,NgFor,NgIf,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
  
})
export class HomeComponent implements OnInit{
  
  
  products: Product[] = [];
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number  = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages:number = 0;
  visiblePages: number[] = [];
  keyword:string = "";

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,    
    private router: Router
    ) {}

  ngOnInit() {
    this.getProducts(this.keyword,
       this.selectedCategoryId, 
       this.currentPage, this.itemsPerPage);
    this.getCategories(1, 100);
  }
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    debugger
    debugger
    this.getProducts(this.keyword.trim(), this.selectedCategoryId, this.currentPage, this.itemsPerPage);

  }
  onProductClick(productId: number) {
    console.log('Clicked product ID:', productId);
    this.router.navigate(['/products', productId]); // Điều hướng đến trang chi tiết sản phẩm
  }
  

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    debugger;
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        debugger;
        response.products.forEach((product: Product) => {
          product.url = `${environment.apiBaseurl}/products/images/${product.thumbnail}`;
        });
        this.products = response.products;
        this.totalPages = response.totalPage;
  
        // Tạo danh sách trang khả dụng để hiển thị
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }
  
  onPageChange(page: number) {
    if (page < 0 || page >= this.totalPages) return; // Kiểm tra hợp lệ
    this.currentPage = page; // Cập nhật trang hiện tại
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5; // Hiển thị tối đa 5 trang
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
  
    let startPage = Math.max(currentPage - halfVisiblePages, 0);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);
  
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 0);
    }
  
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
}
