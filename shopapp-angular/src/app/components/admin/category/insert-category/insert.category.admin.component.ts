import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { InsertCategoryDTO } from "../../../../dtos/insert.category.dto";
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "../../../../models/category";
import { CategoryService } from "../../../../service/category.service";
import { ProductService } from "../../../../service/product.service";
import { HttpErrorResponse } from "@angular/common/http";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-insert.category.admin',
    templateUrl: './insert.category.admin.component.html',
    styleUrls: ['./insert.category.admin.component.scss'],
    standalone: true,
    imports: [   
      CommonModule,
      FormsModule,    
    ]
  })
  export class InsertCategoryAdminComponent implements OnInit {
    insertCategoryDTO: InsertCategoryDTO = {
      name: '',    
    };
    categories: Category[] = []; // Dữ liệu động từ categoryService
    constructor(    
      private route: ActivatedRoute,
      private router: Router,
      private categoryService: CategoryService,    
      private productService: ProductService,    
    ) {
      
    } 
    ngOnInit() {
      
    }   
  
    insertCategory() {    
      this.categoryService.insertCategory(this.insertCategoryDTO).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Thành công!',
            text: 'Danh mục mới đã được thêm.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/admin/categories']);        
          });
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Thêm thất bại!',
            text: error?.error?.message || 'Đã có lỗi xảy ra khi thêm danh mục.',
            icon: 'error',
            confirmButtonText: 'Thử lại'
          });
        }        
      });    
    }    
  }