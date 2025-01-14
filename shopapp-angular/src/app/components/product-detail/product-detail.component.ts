import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NgFor, NgClass } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product';
import { CartService } from '../../service/cart.service';
import { ProductImage } from '../../models/product.image';
import { environment } from '../../environments/environments';
import { CategoryService } from '../../service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgClass, NgFor],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isAddedToCart: boolean = false;  // Trạng thái giỏ hàng

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.productId = +idParam;
      if (!isNaN(this.productId)) {
        this.productService.getDetailProduct(this.productId).subscribe({
          next: (response: any) => {
            if (response.product_images && response.product_images.length > 0) {
              response.product_images.forEach((product_image: ProductImage) => {
                product_image.image_url = `${environment.apiBaseurl}/products/images/${product_image.image_url}`;
              });
            }
            this.product = response;
            this.showImage(0); // Hiển thị ảnh đầu tiên
          },
          error: (error: any) => {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
          }
        });
      }
    }
  }

  showImage(index: number): void {
    if (this.product && this.product.product_images && this.product.product_images.length > 0) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    this.currentImageIndex = index; // Cập nhật ảnh khi click vào thumbnail
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1); // Chuyển sang ảnh tiếp theo
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1); // Chuyển về ảnh trước
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity); // Thêm vào giỏ hàng
      this.isAddedToCart = true; // Đặt trạng thái giỏ hàng
      setTimeout(() => {
        this.isAddedToCart = false; // Ẩn thông báo sau 2 giây
      }, 2000);
    } else {
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì sản phẩm không hợp lệ.');
    }
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.numberProduct) {
      this.quantity++;
    } else if (!this.product) {
      alert('Thông tin sản phẩm không hợp lệ.');
    } else {
      alert('Bạn không thể mua vượt quá số lượng trong kho!');
    }
  }
  

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--; // Giảm số lượng
    }
  }

  buyNow(): void {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity); // Thêm vào giỏ hàng
      this.isAddedToCart = true; // Đặt trạng thái giỏ hàng
      setTimeout(() => {
        this.isAddedToCart = false; // Ẩn thông báo sau 2 giây
      }, 2000);
    } else {
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì sản phẩm không hợp lệ.');
    }
    this.router.navigate(['/orders']); // Mua ngay, chuyển hướng tới trang đơn hàng
  }
}
