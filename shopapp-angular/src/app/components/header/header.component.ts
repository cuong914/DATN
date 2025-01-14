import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from '../../responses/user/user.reponse';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { OrderResponse } from '../../responses/order/order.response';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgbModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNaviItem: number = 0;
  cartItemCount: number = 0;  // Biến lưu trữ số lượng sản phẩm trong giỏ hàng

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService , // Khởi tạo CartService
    private route: ActivatedRoute, 
    private orderService: OrderService
  ) { }

  ngOnInit() {

    // Lấy thông tin người dùng từ localStorage
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    
    // Lắng nghe sự thay đổi số lượng sản phẩm trong giỏ hàng
    this.cartService.getCartItemCount$().subscribe(count => {
      this.cartItemCount = count; // Cập nhật số lượng giỏ hàng
    });
  }

  // Hàm để hiển thị trang giỏ hàng
  goToOrders() {
    this.router.navigate(['/orders']);
  }

  // Hàm để hiển thị trang đăng nhập
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Hàm để quay về trang chủ
  goToHome() {
    this.router.navigate(['/']);
  }
  goToOrder() {
    this.router.navigate(['/']);
  }

  // Hàm để toggle popover
  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }
  // Hàm xử lý khi người dùng click vào menu trong popover
  handleItemClick(index: number): void {
    if (index === 0) {
      this.router.navigate(['/user-profile']);
    } else if (index === 1) {
      this.router.navigate([`/order/detail/:id`]); // Điều hướng tới OrderDetailComponent
    } else if (index === 2) { // Đăng xuất
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = null; // Xóa thông tin người dùng khỏi biến
      this.router.navigate(['/login']); // Điều hướng đến trang đăng nhập
    }
    this.isPopoverOpen = false; // Đóng popover sau khi chọn item
  }
  
  setActiveNavItem(index: number) {
    this.activeNaviItem = index;
  }
}
