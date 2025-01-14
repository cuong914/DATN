import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
// import { CategoryService } from "../../../service/category.service";
// import { Category } from "../../../models/category";
import { Size } from "../../../models/size";
import { SizeService } from "../../../service/size.service";
import { CommonModule } from "@angular/common";
import Swal from 'sweetalert2';


@Component({
    selector: 'app-size-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './size.admin.component.html',
    styleUrls: ['./size.admin.component.scss',        
    ]
  })
  export class SizeAdminComponent implements OnInit {
    sizes: Size[] = []; // Dữ liệu động từ categoryService
    constructor(    
      private sizeService: SizeService,    
      private router: Router,    
      ) {}
      
      ngOnInit() {      
        this.getSizes(0, 100);
      }
      getSizes(page: number, limit: number) {
        this.sizeService.getSizes(page, limit).subscribe({
          next: (sizes: Size[]) => {
            debugger;
            this.sizes = sizes;
          },
          complete: () => {
            debugger;
          },
          error: (error: any) => {
            console.error('Error fetching size:', error);
          }
        });
      }
      insertSize() {
        debugger
        // Điều hướng đến trang detail-category với categoryId là tham số
        this.router.navigate(['/admin/sizes/insert']);
      } 
  
      // Hàm xử lý sự kiện khi sản phẩm được bấm vào
      updateSize(sizeId: number) {
        debugger      
        this.router.navigate(['/admin/sizes/update', sizeId]);
      }  
      trackBySizeId(index: number, size: any): number {
        return size.id;
    }
    
    deleteSize(size: Size) {      
      Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: 'Kích Thước sẽ bị xóa và không thể khôi phục!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          this.sizeService.deleteSize(size.id).subscribe({
            next: (response: string) => {
              Swal.fire(
                'Đã xóa!',
                'Kích Thước đã được xóa thành công.',
                'success'
              );
              this.getSizes(0, 100); // Tải lại danh sách sau khi xóa
            },
            error: (error: any) => {
              Swal.fire(
                'Lỗi!',
                'Không thể xóa kích thước. Vui lòng thử lại.',
                'error'
              );
              console.error('Error deleting size:', error);
            }
          });
        }
      });
  }  
  }