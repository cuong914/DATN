import { Component, Inject, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProductService } from "../../../service/product.service";
import { Product } from "../../../models/product";
import { environment } from "../../../environments/environments";
import { HttpErrorResponse } from "@angular/common/http";
import { ApiResponse } from "../../../responses/api.response";
import { CommonModule, DOCUMENT } from "@angular/common";
import { FormsModule } from "@angular/forms";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-product-admin',
    templateUrl: './product.admin.component.html',
    styleUrls: [
      './product.admin.component.scss',
    ],
    standalone: true,
    imports: [CommonModule,FormsModule],
  })
  export class ProductAdminComponent implements OnInit {
    selectedCategoryId: number  = 0; // Giá trị category được chọn
    products: Product[] = [];
    currentPage: number = 0;
    itemsPerPage: number = 5;
    pages: number[] = [];
    totalPages:number = 0;
    visiblePages: number[] = [];
    keyword:string = "";
    localStorage?:Storage;

    private productService = inject(ProductService);
    private router = inject(Router);
    // private location = inject(Location);

    constructor(
    // @Inject(DOCUMENT) private document: Document
    ) {
      this.localStorage = document.defaultView?.localStorage;
    }
    ngOnInit() {
      this.currentPage = Number(this.localStorage?.getItem('currentProductAdminPage')) || 0;
      // this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
      this.getProducts(this.keyword,
        this.selectedCategoryId,
        this.currentPage, this.itemsPerPage);
    }
    searchProducts() {
      this.currentPage = 0;
      this.itemsPerPage = 5;
      this.getProducts(this.keyword.trim(), this.selectedCategoryId, this.currentPage, this.itemsPerPage);
      if (this.products.length === 0) {
        Swal.fire({
          title: 'Không tìm thấy!',
          text: 'Không có sản phẩm nào phù hợp với từ khóa.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    }
    getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
      debugger
      this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
        next: (response: any) => {
          debugger
          response.products.forEach((product: Product) => {
            product.url = `${environment.apiBaseurl}/products/images/${product.thumbnail}`;
          });
          debugger
          this.products = response.products;
          this.totalPages = response.totalPage;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể tải dữ liệu sản phẩm.',
            icon: 'error',
            confirmButtonText: 'Thử lại'
          });
          console.error('Error fetching products:', error);
        }
      });
    }
    onPageChange(page: number) {
      debugger;
      this.currentPage = page < 0 ? 0 : page;
      this.localStorage?.setItem('currentProductAdminPage', String(this.currentPage));
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }

    generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
      const maxVisiblePages = 5;
      const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    debugger
      let startPage = Math.max(currentPage - halfVisiblePages, 1);
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }
    debugger
      return new Array(endPage - startPage + 1).fill(0)
        .map((_, index) => startPage + index);
    }

    // Hàm xử lý sự kiện khi thêm mới sản phẩm
    insertProduct() {
      this.router.navigate(['/admin/products/insert']);
    }

    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    updateProduct(productId: number) {
      debugger
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/admin/products/update', productId]);
    }
    deleteProduct(product: Product) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa?',
        text: `Sản phẩm "${product.name}" sẽ bị xóa khỏi hệ thống!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          this.productService.deleteProduct(product.id).subscribe({
            next: (apiResponse: ApiResponse) => {
              Swal.fire(
                'Đã Xóa!',
                'Sản phẩm đã được xóa thành công.',
                'success'
              );

              // Gọi lại API để cập nhật danh sách sản phẩm
              this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
            },
            error: (error: HttpErrorResponse) => {
              Swal.fire(
                'Lỗi!',
                'Xóa sản phẩm thất bại. Hãy thử lại.',
                'error'
              );
            }
          });
        }
      });
    }
}
