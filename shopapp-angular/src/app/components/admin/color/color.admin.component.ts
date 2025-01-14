import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
// import { CategoryService } from "../../../service/category.service";
// import { Category } from "../../../models/category";
// import { Size } from "../../../models/size";
import { Color } from "../../../models/color";
// import { SizeService } from "../../../service/size.service";
import { ColorService } from "../../../service/color.service";
import { CommonModule } from "@angular/common";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-color-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './color.admin.component.html',
    styleUrls: ['./color.admin.component.scss',        
    ]
  })
  export class ColorAdminComponent implements OnInit {
    colors: Color[] = []; // Dữ liệu động từ ColorService
    constructor(    
      private colorService: ColorService,    
      private router: Router,    
      ) {}
      
      ngOnInit() {      
        this.getColors(0, 100);
      }
      getColors(page: number, limit: number) {
        this.colorService.getColors(page, limit).subscribe({
          next: (colors: Color[]) => {
            debugger;
            this.colors = colors;
          },
          complete: () => {
            debugger;
          },
          error: (error: any) => {
            console.error('Error fetching colors:', error);
          }
        });
      }
      insertColor() {
        debugger
        // Điều hướng đến trang detail-category với categoryId là tham số
        this.router.navigate(['/admin/colors/insert']);
      } 
  
      // Hàm xử lý sự kiện khi sản phẩm được bấm vào
      updateColor(colorId: number) {
        debugger      
        this.router.navigate(['/admin/colors/update', colorId]);
      }  
      trackByColorId(index: number, color: any): number {
        return color.id;
    }
    
    deleteColor(color: Color) {      
      Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: 'Màu sẽ bị xóa và không thể khôi phục!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          this.colorService.deleteColor(color.id).subscribe({
            next: (response: string) => {
              Swal.fire(
                'Đã xóa!',
                ' Màu đã được xóa thành công.',
                'success'
              );
              this.getColors(0, 100); // Tải lại danh sách sau khi xóa
            },
            error: (error: any) => {
              Swal.fire(
                'Lỗi!',
                'Không thể xóa  Màu. Vui lòng thử lại.',
                'error'
              );
              console.error('Error deleting  Màu:', error);
            }
          });
        }
      });
  }  
  }