import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
// import { InsertCategoryDTO } from "../../../../dtos/insert.category.dto";
import { InsertSizeDTO } from "../../../../dtos/insert.size.dto";
import { ActivatedRoute, Router } from "@angular/router";
// import { Category } from "../../../../models/category";
import { Size } from "../../../../models/size";
// import { CategoryService } from "../../../../service/category.service";
import { SizeService } from "../../../../service/size.service";
import { ProductService } from "../../../../service/product.service";
import { HttpErrorResponse } from "@angular/common/http";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-insert.size.admin',
    templateUrl: './insert.size.admin.component.html',
    styleUrls: ['./insert.size.admin.component.scss'],
    standalone: true,
    imports: [   
      CommonModule,
      FormsModule,    
    ]
  })
  export class InsertSizeAdminComponent implements OnInit {
    insertSizeDTO: InsertSizeDTO = {
      name: '',    
    };
    sizes: Size[] = []; // Dữ liệu động từ SizeService
    constructor(    
      private route: ActivatedRoute,
      private router: Router,
      private sizeService: SizeService,    
      private productService: ProductService,    
    ) {
      
    } 
    ngOnInit() {
      
    }   
  
    insertSize() {    
      this.sizeService.insertSize(this.insertSizeDTO).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Thành công!',
            text: 'Kích thước mới đã được thêm.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/admin/sizes']);        
          });
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Thêm thất bại!',
            text: error?.error?.message || 'Đã có lỗi xảy ra khi thêm kích thước.',
            icon: 'error',
            confirmButtonText: 'Thử lại'
          });
        }        
      });    
    }    
  }