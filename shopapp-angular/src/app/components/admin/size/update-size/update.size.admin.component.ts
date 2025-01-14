import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
// import { Category } from "../../../../models/category";
import { Size } from "../../../../models/size";
// import { CategoryService } from "../../../../service/category.service";
import { SizeService } from "../../../../service/size.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiResponse } from "../../../../responses/api.response";
import { HttpErrorResponse } from "@angular/common/http";
// import { UpdateCategoryDTO } from "../../../../dtos/update.category.dto";
import { UpdateSizeDTO } from "../../../../dtos/update.size.dto";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-detail.size.admin',
    templateUrl: './update.size.admin.component.html',
    styleUrls: ['./update.size.admin.component.scss'],
    standalone: true,
    imports: [   
      CommonModule,
      FormsModule,
    ]
  })
  
  export class UpdateSizeAdminComponent implements OnInit {
    sizeId: number;
    updatedSize: Size;
    
    constructor(
      private sizeService: SizeService,
      private route: ActivatedRoute,
      private router: Router,
    
    ) {
      this.sizeId = 0;    
      this.updatedSize = {} as Size;  
    }
  
    ngOnInit(): void {    
      this.route.paramMap.subscribe(params => {
        debugger
        this.sizeId = Number(params.get('id'));
        this.getSizeDetails();
      });
      
    }
    
    updateSize() {
      const updateSizeDTO: UpdateSizeDTO = {
        name: this.updatedSize.name,
      };
    
      this.sizeService.updateSize(this.updatedSize.id, updateSizeDTO).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Cập nhật thành công!',
            text: 'Kích thước đã được cập nhật.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/admin/sizes']);
          });
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Cập nhật thất bại!',
            text: error?.error?.message || 'Đã có lỗi xảy ra khi cập nhật kích thước.',
            icon: 'error',
            confirmButtonText: 'Thử lại'
          });
        }
      });
    }
    
    getSizeDetails(): void {
      this.sizeService.getDetailSize(this.sizeId).subscribe({
        next: (apiResponse: ApiResponse) => {
          this.updatedSize = { ...apiResponse.data };
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể tải thông tin kích thước.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }    
  }