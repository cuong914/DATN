import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
// import { InsertCategoryDTO } from "../../../../dtos/insert.category.dto";
// import { InsertSizeDTO } from "../../../../dtos/insert.size.dto";
import { InsertColorDTO } from "../../../../dtos/insert.color.dto";
import { ActivatedRoute, Router } from "@angular/router";
// import { Category } from "../../../../models/category";
// import { Size } from "../../../../models/size";
import { Color } from "../../../../models/color";
// import { CategoryService } from "../../../../service/category.service";
// import { SizeService } from "../../../../service/size.service";
import { ColorService } from "../../../../service/color.service";
import { ProductService } from "../../../../service/product.service";
import { HttpErrorResponse } from "@angular/common/http";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-insert.color.admin',
    templateUrl: './insert.color.admin.component.html',
    styleUrls: ['./insert.color.admin.component.scss'],
    standalone: true,
    imports: [   
      CommonModule,
      FormsModule,    
    ]
  })
  export class InsertColorAdminComponent implements OnInit {
    insertColorDTO: InsertColorDTO = {
      name: '',    
    };
    colors: Color[] = []; // Dữ liệu động từ SizeService
    constructor(    
      private route: ActivatedRoute,
      private router: Router,
      private colorService: ColorService,    
      private productService: ProductService,    
    ) {
      
    } 
    ngOnInit() {
      
    }   
  
    insertColor() {    
      this.colorService.insertColor(this.insertColorDTO).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Thành công!',
            text: 'Màu Sắc mới đã được thêm.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/admin/colors']);        
          });
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Thêm thất bại!',
            text: error?.error?.message || 'Đã có lỗi xảy ra khi thêm Màu Sắc.',
            icon: 'error',
            confirmButtonText: 'Thử lại'
          });
        }        
      });    
    }    
  }