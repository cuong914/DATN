import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Product } from "../../../../models/product";
import { Category } from "../../../../models/category";
import { ProductService } from "../../../../service/product.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "../../../../service/category.service";
import { ApiResponse } from "../../../../responses/api.response";
import { HttpErrorResponse } from "@angular/common/http";
import { ProductImage } from "../../../../models/product.image";
import { environment } from "../../../../environments/environments";
import { UpdateProductDTO } from "../../../../dtos/update.product.dto";
import Swal from 'sweetalert2';
import { Size } from "../../../../models/size";
import { SizeService } from "../../../../service/size.service";
import { ColorService } from "../../../../service/color.service";
import { Color } from "../../../../models/color";

@Component({
    selector: 'app-detail.product.admin',
    templateUrl: './update.product.admin.component.html',
    styleUrls: ['./update.product.admin.component.scss'],
    standalone: true,
    imports: [   
      CommonModule,
      FormsModule,
    ]
  })
  
  export class UpdateProductAdminComponent implements OnInit {
    productId: number;
    product: Product;
    updatedProduct: Product;
    categories: Category[] = [];
   sizes: Size[] = [];
   colors: Color[]=[];
    // Dữ liệu động từ categoryService
    currentImageIndex: number = 0;
    images: File[] = [];
  
    constructor(
      private productService: ProductService,
      private route: ActivatedRoute,
      private router: Router,
      private categoryService: CategoryService,   
      private sizeService : SizeService, 
      private colorService : ColorService,
    //   private location: Location,
    ) {
      this.productId = 0;
      this.product = {} as Product;
      this.updatedProduct = {} as Product;  
    }
  
    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.productId = Number(params.get('id'));
        this.getProductDetails();
      });
      this.getCategories(1, 100);
      this.getSizes(1,100);
      this.getColors(1,100);
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
          console.log("Sizes:", sizes); // Kiểm tra sizes
          this.sizes = sizes;
        },
        error: (error: any) => {
          console.error('Error fetching size:', error);
        }
      });
    }
    
    getColors(page: number, limit: number) {
      this.colorService.getColors(page, limit).subscribe({
        next: (colors: Color[]) => {
          console.log("Colors:", colors); // Kiểm tra colors
          this.colors = colors;
        },
        error: (error: any) => {
          console.error('Error fetching colors:', error);
        }
      });
    }

    getProductDetails(): void {
      debugger
      this.productService.getDetailProductsssss(this.productId).subscribe({
        next: (apiResponse: ApiResponse) => {
  debugger
          this.product = apiResponse.data;
          this.updatedProduct = { ...apiResponse.data };     
          debugger           
          this.updatedProduct.product_images.forEach((product_image:ProductImage) => {
            product_image.image_url = `${environment.apiBaseurl}/products/images/${product_image.image_url}`;
          });
        },
        complete: () => {
          
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        } 
      });     
    }
    updateProduct() {
      const updateProductDTO: UpdateProductDTO = {
        name: this.updatedProduct.name,
        price: this.updatedProduct.price,
        active: this.updatedProduct.active,
        numberProduct: this.updatedProduct.numberProduct,
        description: this.updatedProduct.description,
        size_id : this.updatedProduct.size_id,
        color_id : this.updatedProduct.color_id,
        category_id: this.updatedProduct.category_id
      };
    
      this.productService.updateProduct(this.product.id, updateProductDTO).subscribe({
        next: () => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cập nhật sản phẩm thành công!',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/admin/products']);
          });
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Cập nhật thất bại!',
            text: 'Đã có lỗi xảy ra khi cập nhật sản phẩm.',
            confirmButtonText: 'Thử lại'
          });
          console.error(error?.error?.message ?? '');
        }
      });
    }    
    showImage(index: number): void {
      debugger
      if (this.product && this.product.product_images && 
          this.product.product_images.length > 0) {
        // Đảm bảo index nằm trong khoảng hợp lệ        
        if (index < 0) {
          index = 0;
        } else if (index >= this.product.product_images.length) {
          index = this.product.product_images.length - 1;
        }        
        // Gán index hiện tại và cập nhật ảnh hiển thị
        this.currentImageIndex = index;
      }
    }
    thumbnailClick(index: number) {
      debugger
      // Gọi khi một thumbnail được bấm
      this.currentImageIndex = index; // Cập nhật currentImageIndex
    }  
    nextImage(): void {
      debugger
      this.showImage(this.currentImageIndex + 1);
    }
  
    previousImage(): void {
      debugger
      this.showImage(this.currentImageIndex - 1);
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
    
      this.images = files;
    
      this.productService.uploadImages(this.productId, this.images).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Tải ảnh lên thành công!',
            showConfirmButton: false,
            timer: 1500
          });
          this.getProductDetails();  // Tải lại chi tiết sản phẩm
          this.images = [];
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi tải ảnh!',
            text: 'Không thể tải ảnh lên. Vui lòng thử lại.',
            confirmButtonText: 'OK'
          });
          console.error(error?.error?.message ?? '');
        }
      });
    }
    
    deleteImage(productImage: ProductImage) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa ảnh này?',
        text: 'Hành động này không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          this.productService.deleteProductImage(productImage.id).subscribe({
            next: () => {
              Swal.fire(
                'Đã Xóa!',
                'Ảnh đã được xóa thành công.',
                'success'
              );
              // Tải lại chi tiết sản phẩm để cập nhật danh sách ảnh
              this.getProductDetails();
            },
            error: (error: HttpErrorResponse) => {
              Swal.fire(
                'Lỗi!',
                'Không thể xóa ảnh. Vui lòng thử lại.',
                'error'
              );
              console.error(error?.error?.message ?? '');
            }
          });
        }
      });
    }    
  }