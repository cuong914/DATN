import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { Product } from '../../models/product';
import { OrderDTO } from '../../dtos/order/order_dto';
import { CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.service';
import { OrderService } from '../../service/order.service';
import { environment } from '../../environments/environments';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf,NgClass,NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from '../../Interceptors/token.interceptors';
import { TokenService } from '../../service/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order';
import { ApiResponse } from '../../responses/api.response';
import { CouponService } from '../../service/coupons.service';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [FooterComponent,HeaderComponent,FormsModule,NgClass,NgFor,NgIf,CommonModule,ReactiveFormsModule ,HttpClientModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  providers :[
    OrderService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
})
export class OrderComponent implements OnInit{
  orderForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: { product: Product, quantity: number }[] = [];
  couponDiscount: number = 0; //số tiền được discount từ coupon
  couponApplied: boolean = false;
  couponCode: string = ''; // Mã giảm giá
  totalAmount: number = 0; // Tổng tiền
  cart: Map<number, number> = new Map();
  orderData: OrderDTO = {
    user_id: 0, // Thay bằng user_id thích hợp
    fullname: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form    
    phone_number: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    status: 'pending',
    note: '', // Có thể thêm trường ghi chú nếu cần
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    payment_method: 'cod', // Mặc định là thanh toán khi nhận hàng (COD)
    shipping_method: 'express', // Mặc định là vận chuyển nhanh (Express)
    coupon_code: '', // Sẽ được điền từ form khi áp dụng mã giảm giá
    cart_items: []
  };

  constructor(
    private couponService : CouponService,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc      
      email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: [''],
      shipping_method: ['express'],
      couponCode: [''],
      payment_method: ['cod']
    });
  }
  
  ngOnInit(): void {  
    debugger
    //this.cartService.clearCart();
    this.orderData.user_id = this.tokenService.getUserId();    
    // Lấy danh sách sản phẩm từ giỏ hàng
    debugger
    this.cart = this.cartService.getCart();
    const productIds = Array.from(this.cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng    

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    debugger    
    if(productIds.length === 0) {
      return;
    }    
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {            
        debugger
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          debugger
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseurl}/products/images/${product.thumbnail}`;
          }          
          return {
            product: product!,
            quantity: this.cart.get(productId)!
          };
        });
        console.log('haha');
      },
      complete: () => {
        debugger;
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });        
  }
  placeOrder() {
    debugger
    if (this.orderForm.errors == null) {
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };
      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      this.orderData.total_money =  this.totalAmount;
      // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
      debugger
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response:Order) => {
          
          debugger;        
          
        // Lấy paymentUrl từ response
        const paymentUrl = response.paymentUrl;
        

        if (paymentUrl) {
          // Điều hướng đến paymentUrl trong cùng tab
        //  window.location.href = paymentUrl;

          // Hoặc nếu muốn mở trong tab mới:
        window.open(paymentUrl, '_blank');
         
          alert('Thanh toán thành công  .');
          this.cartService.clearCart();
          this.router.navigate(['/']);
          // this.router.navigate(['orders/vnpay-payment']);
        } else {
          alert('đăt hàng  thành công  .');
          this.cartService.clearCart();
          // this.router.navigate(['orders/vnpay-payment']);
          this.router.navigate(['/']);
        }
      },  
        //   alert('Đặt hàng thành công');
        //   this.cartService.clearCart();
        //   this.router.navigate(['/']);
        // },
        complete: () => {
          debugger;
          this.calculateTotal();
        },
        error: (error: any) => {
          debugger;
          alert(`Lỗi khi đặt hàng: ${error}`);
        },
      });
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }        
  }
    
  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }
  
  increaseQuantity(index: number): void {
    const item = this.cartItems[index];
    if (item.quantity < item.product.numberProduct) {
      item.quantity++;
    } else {
      alert('Bạn không thể mua vượt quá số lượng sản phẩm có trong kho!');
    }
  }
  
  
  // Hàm tính tổng tiền
  calculateTotal(): void {
      this.totalAmount = this.cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
      );
  }
  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      // Xóa sản phẩm khỏi danh sách cartItems
      this.cartItems.splice(index, 1);
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      // Tính toán lại tổng tiền
      this.calculateTotal();
    }
  }
  // Hàm xử lý việc áp dụng mã giảm giá
   // Hàm xử lý việc áp dụng mã giảm giá
   applyCoupon(): void {
    debugger
    const couponCode = this.orderForm.get('couponCode')!.value;
    if (!this.couponApplied && couponCode) {
      debugger
      this.calculateTotal();
      debugger
      this.couponService.calculateCouponValue(couponCode, this.totalAmount)
        .subscribe({
          next: (apiResponse: ApiResponse) => {
            debugger
            this.totalAmount = Number(apiResponse.data.result);
            this.couponApplied = true;
          }
        });
    }
  }
  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }
}