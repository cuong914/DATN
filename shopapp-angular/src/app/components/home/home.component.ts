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

    // this.getProducts(this.keyword,
    //    this.selectedCategoryId,
    //     this.currentPage, this.itemsPerPage);
  }
//   getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
//     debugger
//     this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
//       next: (response: any) => {
//         debugger
//         response.products.forEach((product: Product) => {          
//           product.url = `${environment.apiBaseurl}/products/images/${product.thumbnail}`;
//         });
//     //     console.log('API Response:', response); // Kiểm tra phản hồi API
//     // this.products = response.products;
    
//     // if (response.totalPages !== undefined) {
//     //     this.totalPages = response.totalPages;
//     // } else {
//     //     console.error('totalPages is undefined in API response');
//     // }
    
//     // this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
//         this.products = response.products;
//         this.totalPages = response.totalPage;
//         console.log('Current Page:', this.currentPage, 'Total Pages:', this.totalPages);
// this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
//         // this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
//       },
//       complete: () => {
//         debugger;
//       },
//       error: (error: any) => {
//         debugger;
//         console.error('Error fetching products:', error);
//       }
//     });    
//   }

getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
  debugger
  this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
    next: (response: any) => {
      debugger
      response.products.forEach((product: Product) => {          
        product.url = `${environment.apiBaseurl}/products/images/${product.thumbnail}`;
      });
      this.products = response.products;
      this.totalPages = response.totalPage;
      console.log('Current Page:', this.currentPage, 'Total Pages:', this.totalPages);
this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      // this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
    },
    complete: () => {
      debugger;
    },
    error: (error: any) => {
      debugger;
      console.error('Error fetching products:', error);
    }
  });    
}
  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }
  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  onProductClick(productId: number) {
    debugger
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/products', productId]);
  }  
}
