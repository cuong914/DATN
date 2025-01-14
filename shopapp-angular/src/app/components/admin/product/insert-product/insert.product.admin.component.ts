import { Component, OnInit } from "@angular/core";
import { InsertProductDTO } from "../../../../dtos/insert.product.dto";
import { Category } from "../../../../models/category";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "../../../../service/category.service";
import { ProductService } from "../../../../service/product.service";
import { FormsModule } from "@angular/forms";
import { NgFor } from "@angular/common";
import Swal from 'sweetalert2';
import { SizeService } from "../../../../service/size.service";
import { Size } from "../../../../models/size";


@Component({
    selector: 'app-insert.product.admin',
    standalone :true,
    imports : [FormsModule,NgFor],
    templateUrl: './insert.product.admin.component.html',
    styleUrls: ['./insert.product.admin.component.scss']
  })

export class InsertProductAdminComponent implements OnInit {
    insertProductDTO: InsertProductDTO = {
      name: '',
      price: 0,
      description: '',
      size_id: 1,
      color: '',
      active: true,
      numberProduct: 0,
      category_id: 1,
      images: []
    };
    categories: Category[] = [];
  sizes: Size[] = [];// Dữ liệu động từ categoryService
    constructor(    
      private route: ActivatedRoute,
      private router: Router,
      private categoryService: CategoryService,  
      private sizeService :SizeService,  
      private productService: ProductService,    
    ) {
      
    } 
    ngOnInit() {
      this.getCategories(1, 100)
      this.getSizes(1,100)
    } 
    getCategories(page: number, limit: number) {
        this.categoryService.getCategories(page, limit).subscribe({
          next: (categories: Category[]) => {
            debugger
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

      getSizes(page: number, limit: number) {
        this.sizeService.getSizes(page, limit).subscribe({
          next: (sizes: Size[]) => {
            debugger
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

      onFileChange(event: any) {
        const files = event.target.files;
        if (files.length > 5) {
          Swal.fire({
            icon: 'warning',
            title: 'Quá nhiều ảnh!',
            text: 'Vui lòng chọn tối đa 5 ảnh.',
            confirmButtonText: 'OK'
          });
          return;
        }
        this.insertProductDTO.images = files;
      }
  
      insertProduct() {
        this.productService.insertProduct(this.insertProductDTO).subscribe({
          next: (response) => {
            if (this.insertProductDTO.images.length > 0) {
              const productId = response.id;
              this.productService.uploadImages(productId, this.insertProductDTO.images).subscribe({
                next: () => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Sản phẩm và hình ảnh đã được thêm thành công.',
                    showConfirmButton: false,
                    timer: 2000
                  }).then(() => {
                    this.router.navigate(['../'], { relativeTo: this.route });
                  });
                },
                error: (error) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Lỗi tải ảnh!',
                    text: error.error || 'Không thể tải ảnh lên. Vui lòng thử lại.',
                    confirmButtonText: 'OK'
                  });
                }
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Thêm sản phẩm thành công!',
                text: 'Sản phẩm đã được thêm nhưng không có ảnh.',
                showConfirmButton: false,
                timer: 2000
              }).then(() => {
                this.router.navigate(['../'], { relativeTo: this.route });
              });
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi khi thêm sản phẩm!',
              text: error.error || 'Không thể thêm sản phẩm. Vui lòng thử lại.',
              confirmButtonText: 'Thử lại'
            });
          }
        });
      }
  }