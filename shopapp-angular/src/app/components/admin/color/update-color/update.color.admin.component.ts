import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
// import { Category } from "../../../../models/category";
// import { Size } from "../../../../models/size";
import { Color } from "../../../../models/color";
// import { CategoryService } from "../../../../service/category.service";
// import { SizeService } from "../../../../service/size.service";

import { ColorService } from "../../../../service/color.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiResponse } from "../../../../responses/api.response";
import { HttpErrorResponse } from "@angular/common/http";
// import { UpdateCategoryDTO } from "../../../../dtos/update.category.dto";
// import { UpdateSizeDTO } from "../../../../dtos/update.size.dto";
import { UpdateColorDTO } from "../../../../dtos/update.color.dto";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-detail.color.admin',
    templateUrl: './update.color.admin.component.html',
    styleUrls: ['./update.color.admin.component.scss'],
    standalone: true,
    imports: [   
      CommonModule,
      FormsModule,
    ]
  })
  
  export class UpdateColorAdminComponent implements OnInit {
    colorId: number;
    updatedColor: Color;
    
    constructor(
      private colorService: ColorService,
      private route: ActivatedRoute,
      private router: Router,
    
    ) {
      this.colorId = 0;    
      this.updatedColor = {} as Color;  
    }
  
    ngOnInit(): void {    
      this.route.paramMap.subscribe(params => {
        debugger
        this.colorId = Number(params.get('id'));
        this.getColorDetails();
      });
      
    }
    
    updateColor() {
      const updateColorDTO: UpdateColorDTO = {
        name: this.updatedColor.name,
      };
    
      this.colorService.updateColor(this.updatedColor.id, updateColorDTO).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Cập nhật thành công!',
            text: 'Màu Sắc  đã được cập nhật.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/admin/colors']);
          });
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Cập nhật thất bại!',
            text: error?.error?.message || 'Đã có lỗi xảy ra khi cập nhật Màu Sắc  .',
            icon: 'error',
            confirmButtonText: 'Thử lại'
          });
        }
      });
    }
    
    getColorDetails(): void {
      this.colorService.getDetailColor(this.colorId).subscribe({
        next: (apiResponse: ApiResponse) => {
          this.updatedColor = { ...apiResponse.data };
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể tải thông tin Màu Sắc .',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }    
  }