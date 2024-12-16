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
    categories: Category[] = []; // Dữ liệu động từ categoryService
    currentImageIndex: number = 0;
    images: File[] = [];
  
    constructor(
      private productService: ProductService,
      private route: ActivatedRoute,
      private router: Router,
      private categoryService: CategoryService,    
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
    }
    // getCategories(page: number, limit: number) {
    //   this.categoryService.getCategories(page, limit).subscribe({
    //     next: (apiResponse: ApiResponse) => {
    //       debugger;
    //       this.categories = apiResponse.data;
    //     },
    //     complete: () => {
    //       debugger;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       debugger;
    //       console.error(error?.error?.message ?? '');
    //     } 
    //   });
    // }

    // Hàm thay đổi trạng thái active
  // toggleActive() {
  //   this.product.active = !this.product.active;  // Chuyển trạng thái giữa true và false
  // }

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

    
  //   if (!isNaN(this.productId)) {
  //     this.productService.getDetailProduct(this.productId).subscribe({
  //       next: (response: any) => {            
  //         // Lấy danh sách ảnh sản phẩm và thay đổi URL
  //         debugger
  //         if (response.product_images && response.product_images.length > 0) {
  //           response.product_images.forEach((product_image:ProductImage) => {
  //             product_image.image_url = `${environment.apiBaseurl}/products/images/${product_image.image_url}`;
  //           });
  //         }            
  //         debugger
  //         this.product = response 
  //         // Bắt đầu với ảnh đầu tiên
  //         this.showImage(0);
  //       },
  //       complete: () => {
  //         debugger;
  //       },
  //       error: (error: any) => {
  //         debugger;
  //         console.error('Error fetching detail:', error);
  //       }
  //     });    
  //   } else {
  //     console.error('Invalid productId:', idParam);
  //   }      
  // }

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
      // Implement your update logic here
      const updateProductDTO: UpdateProductDTO = {
        name: this.updatedProduct.name,
        price: this.updatedProduct.price,
        active: this.updatedProduct.active,
        numberProduct: this.updatedProduct.numberProduct,
        description: this.updatedProduct.description,
        category_id: this.updatedProduct.category_id
      };
      this.productService.updateProduct(this.product.id, updateProductDTO).subscribe({
        next: (apiResponse: ApiResponse) => {  
          debugger        
        },
        complete: () => {
          debugger;
          this.router.navigate(['/admin/products']);        
        },
        error: (error: HttpErrorResponse) => {
          debugger;
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
      // Retrieve selected files from input element
      const files = event.target.files;
      // Limit the number of selected files to 5
      if (files.length > 5) {
        console.error('Please select a maximum of 5 images.');
        return;
      }
      // Store the selected files in the newProduct object
      this.images = files;
      this.productService.uploadImages(this.productId, this.images).subscribe({
        next: (apiResponse: ApiResponse) => {
          debugger
          // Handle the uploaded images response if needed              
          console.log('Images uploaded successfully:', apiResponse);
          this.images = [];       
          // Reload product details to reflect the new images
          this.getProductDetails(); 
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        } 
      })
    }
    deleteImage(productImage: ProductImage) {
      if (confirm('Are you sure you want to remove this image?')) {
        // Call the removeImage() method to remove the image   
        this.productService.deleteProductImage(productImage.id).subscribe({
          next:(productImage: ProductImage) => {
            location.reload();          
          },        
          error: (error: HttpErrorResponse) => {
            debugger;
            console.error(error?.error?.message ?? '');
          } 
        });
      }   
    }
  }