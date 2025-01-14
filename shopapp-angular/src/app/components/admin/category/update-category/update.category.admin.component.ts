import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Category } from "../../../../models/category";
import { CategoryService } from "../../../../service/category.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiResponse } from "../../../../responses/api.response";
import { HttpErrorResponse } from "@angular/common/http";
import { UpdateCategoryDTO } from "../../../../dtos/update.category.dto";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-detail.category.admin',
    templateUrl: './update.category.admin.component.html',
    styleUrls: ['./update.category.admin.component.scss'],
    standalone: true,
    imports: [   
      CommonModule,
      FormsModule,
    ]
  })
  
  export class UpdateCategoryAdminComponent implements OnInit {
    categoryId: number;
    updatedCategory: Category;
    
    constructor(
      private categoryService: CategoryService,
      private route: ActivatedRoute,
      private router: Router,
    
    ) {
      this.categoryId = 0;    
      this.updatedCategory = {} as Category;  
    }
  
    ngOnInit(): void {    
      this.route.paramMap.subscribe(params => {
        debugger
        this.categoryId = Number(params.get('id'));
        this.getCategoryDetails();
      });
      
    }
    
    updateCategory() {
      const updateCategoryDTO: UpdateCategoryDTO = {
        name: this.updatedCategory.name,
      };
    
      this.categoryService.updateCategory(this.updatedCategory.id, updateCategoryDTO).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Cập nhật thành công!',
            text: 'Danh mục đã được cập nhật.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/admin/categories']);
          });
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Cập nhật thất bại!',
            text: error?.error?.message || 'Đã có lỗi xảy ra khi cập nhật danh mục.',
            icon: 'error',
            confirmButtonText: 'Thử lại'
          });
        }
      });
    }
    
    getCategoryDetails(): void {
      this.categoryService.getDetailCategory(this.categoryId).subscribe({
        next: (apiResponse: ApiResponse) => {
          this.updatedCategory = { ...apiResponse.data };
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể tải thông tin danh mục.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }    
  }