import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { Product } from '../../models/product';
import { CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.service';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environments';
import { NgFor,NgClass, CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../service/order.service';
import { OrderResponse } from '../../responses/order/order.response';
import { OrderDetail } from '../../models/order.detail';
@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgFor, NgClass, FormsModule, CommonModule, RouterModule],
  templateUrl: './order.detail.component.html',
  styleUrls: ['./order.detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  orderResponse: OrderResponse = {
    id: 0,
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: []
  };

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const orderId = this.activatedRoute.snapshot.paramMap.get('id'); // Lấy `orderId` từ URL
    if (orderId) {
      this.getOrderDetails(+orderId); // Chuyển đổi `orderId` thành kiểu số
    } else {
      console.error('ID đơn hàng không hợp lệ.');
      this.router.navigate(['/orders']); // Điều hướng về danh sách đơn hàng nếu `orderId` không hợp lệ
    }
  }

  getOrderDetails(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.email = response.email;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.address = response.address;
        this.orderResponse.note = response.note;
        this.orderResponse.order_date = new Date(
          response.order_date[0],
          response.order_date[1] - 1,
          response.order_date[2]
        );

        this.orderResponse.order_details = response.order_details.map(
          (order_detail: OrderDetail) => {
            order_detail.product.thumbnail = `${environment.apiBaseurl}/products/images/${order_detail.product.thumbnail}`;
            return order_detail;
          }
        );
        this.orderResponse.payment_method = response.payment_method;
        this.orderResponse.shipping_date = new Date(
          response.shipping_date[0],
          response.shipping_date[1] - 1,
          response.shipping_date[2]
        );
        this.orderResponse.shipping_method = response.shipping_method;
        this.orderResponse.status = response.status;
        this.orderResponse.total_money = response.total_money;
      },
      error: (error: any) => {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        alert('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại!');
        this.router.navigate(['/orders']); // Điều hướng về danh sách đơn hàng nếu có lỗi
      }
    });
  }
}