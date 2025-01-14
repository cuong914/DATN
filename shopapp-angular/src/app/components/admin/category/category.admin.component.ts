import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CategoryService } from "../../../service/category.service";
import { Category } from "../../../models/category";
import { CommonModule } from "@angular/common";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-category-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './category.admin.component.html',
    styleUrls: ['./category.admin.component.scss',        
    ]
  })
  export class CategoryAdminComponent implements OnInit {
    categories: Category[] = []; // Dữ liệu động từ categoryService
    constructor(    
      private categoryService: CategoryService,    
      private router: Router,    
      ) {}
      
      ngOnInit() {      
        this.getCategories(0, 100);
      }
      getCategories(page: number, limit: number) {
        this.categoryService.getCategories(page, limit).subscribe({
          next: (categories: Category[]) => {
            debugger;
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
      insertCategory() {
        debugger
        // Điều hướng đến trang detail-category với categoryId là tham số
        this.router.navigate(['/admin/categories/insert']);
      } 
  
      // Hàm xử lý sự kiện khi sản phẩm được bấm vào
      updateCategory(categoryId: number) {
        debugger      
        this.router.navigate(['/admin/categories/update', categoryId]);
      }  
      trackByCategoryId(index: number, category: any): number {
        return category.id;
    }
    
    deleteCategory(category: Category) {      
      Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: 'Danh mục sẽ bị xóa và không thể khôi phục!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          this.categoryService.deleteCategory(category.id).subscribe({
            next: (response: string) => {
              Swal.fire(
                'Đã xóa!',
                'Danh mục đã được xóa thành công.',
                'success'
              );
              this.getCategories(0, 100); // Tải lại danh sách sau khi xóa
            },
            error: (error: any) => {
              Swal.fire(
                'Lỗi!',
                'Không thể xóa danh mục. Vui lòng thử lại.',
                'error'
              );
              console.error('Error deleting category:', error);
            }
          });
        }
      });
  }  
  }