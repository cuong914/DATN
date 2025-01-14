import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environments';
import { CartService } from '../service/cart.service';
import { ProductService } from '../service/product.service';
import { Product } from '../models/product';
import { SizeService } from '../service/size.service';
import { Size } from '../models/size';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-banhang',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './banhang.component.html',
  styleUrls: ['./banhang.component.scss'],
})
export class BanhangComponent implements OnInit {
  products: Product[] = []; // Danh sách sản phẩm
  cartItems: any[] = [];
  waitingOrders: any[] = []; // Danh sách hóa đơn chờ
  selectedProduct: Product | null = null; // Sản phẩm đang chọn (cho highlight)
  totalMoney: number = 0;
  selectedOrder: any = null; // Hóa đơn hiện tại
  amountGiven: number = 0; // Tiền khách đưa
  change: number = 0; // Tiền thừa

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private sizeService: SizeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrdersFromLocalStorage(); // Tải hóa đơn từ localStorage
  }
  calculateChange(): void {
    if (this.selectedOrder) {
      this.change = this.amountGiven - this.selectedOrder.totalMoney;
    }
  }

  loadProducts(): void {
    this.productService.getAll().subscribe((response: any) => {
      this.products = response.map((product: any) => ({
        ...product,
        url: `${environment.apiBaseurl}/products/images/${product.thumbnail || 'default.png'}`,
        sizeName: product.size?.name, // Gán sizeName từ product.size.name
      }));
      this.saveProductsToLocalStorage();
    });
  }
  
  // Lưu hóa đơn vào localStorage
  saveOrdersToLocalStorage(): void {
    try {
      localStorage.setItem('waitingOrders', JSON.stringify(this.waitingOrders));
    } catch (error) {
      Swal.fire('Error', 'Không thể lưu hóa đơn. Vui lòng kiểm tra cài đặt trình duyệt!', 'error');
    }
  }

  // Tải hóa đơn từ localStorage
  loadOrdersFromLocalStorage(): void {
    try {
      const savedOrders = localStorage.getItem('waitingOrders');
      if (savedOrders) {
        this.waitingOrders = JSON.parse(savedOrders);
      }
    } catch (error) {
      Swal.fire('Error', 'Không thể tải hóa đơn. Vui lòng kiểm tra cài đặt trình duyệt!', 'error');
    }
  }

  // Tạo hóa đơn mới
  createNewOrder(): void {
    const newOrder = {
      id: `HD-${Date.now()}`, // Tạo mã hóa đơn duy nhất
      totalMoney: 0, // Tổng tiền ban đầu là 0
      items: [], // Danh sách sản phẩm rỗng
    };
    this.waitingOrders.push(newOrder); // Thêm hóa đơn vào danh sách
    this.selectOrder(newOrder); // Chọn hóa đơn vừa tạo
    this.saveOrdersToLocalStorage(); // Lưu vào localStorage
    Swal.fire('Success', 'Hóa đơn mới đã được tạo!', 'success');
  }

  // Chọn hóa đơn từ danh sách
  selectOrder(order: any): void {
    this.selectedOrder = order; // Gán hóa đơn đang chọn
  }

  removeWaitingOrder(index: number): void {
    const removedOrder = this.waitingOrders.splice(index, 1)[0]; // Xóa hóa đơn khỏi danh sách
  
    if (removedOrder && removedOrder.items) {
      // Cộng lại số lượng sản phẩm vào kho
      removedOrder.items.forEach((item: any) => {
        const product = this.products.find((p) => p.id === item.product_id);
        if (product) {
          product.numberProduct += item.quantity; // Cộng lại số lượng sản phẩm
        }
      });
    }
  
    // Nếu hóa đơn vừa xóa là hóa đơn đang chọn, đặt lại selectedOrder
    if (this.selectedOrder && this.selectedOrder.id === removedOrder.id) {
      this.selectedOrder = null; // Đặt lại hóa đơn đang chọn
    }
  
    // Lưu trạng thái sản phẩm và hóa đơn vào localStorage
    this.saveProductsToLocalStorage();
    this.saveOrdersToLocalStorage();
  
    // Hiển thị thông báo
    Swal.fire('Success', 'Hóa đơn đã được xóa và số lượng sản phẩm đã được trả lại vào kho.', 'success');
  }
  
  // Thêm sản phẩm vào hóa đơn đang chọn
  addToOrder(product: Product, quantity: number = 1): void {
    if (!this.selectedOrder) {
      Swal.fire('Warning', 'Vui lòng chọn hóa đơn để thêm sản phẩm.', 'warning');
      return;
    }
  
    // Kiểm tra tồn kho
    if (quantity <= 0 || quantity > product.numberProduct) {
      Swal.fire('Warning', 'Số lượng không hợp lệ.', 'warning');
      return;
    }
  
    // Tìm sản phẩm trong hóa đơn
    const existingItem = this.selectedOrder.items.find(
      (item: any) => item.product_id === product.id
    );
  
    if (existingItem) {
      existingItem.quantity += quantity; // Tăng số lượng nếu sản phẩm đã tồn tại
    } else {
      this.selectedOrder.items.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      });
    }
  
    // Giảm số lượng sản phẩm trực tiếp
    product.numberProduct -= quantity;
  
    // Lưu trạng thái sản phẩm vào localStorage
    this.saveProductsToLocalStorage();
  
    // Tính lại tổng tiền và lưu vào localStorage
    this.calculateTotalMoney();
    this.saveOrdersToLocalStorage();
  }
  
  // Lưu trạng thái sản phẩm vào localStorage
  saveProductsToLocalStorage(): void {
    localStorage.setItem('products', JSON.stringify(this.products));
  }
  // Tính tổng tiền hóa đơn
  calculateTotalMoney(): void {
    if (this.selectedOrder) {
      this.selectedOrder.totalMoney = this.selectedOrder.items.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0
      );
      this.saveOrdersToLocalStorage(); // Lưu tổng tiền sau khi cập nhật
    }
  }

  // Xóa sản phẩm khỏi hóa đơn
  removeItemFromOrder(item: any): void {
    if (!this.selectedOrder) return;

    const index = this.selectedOrder.items.indexOf(item);
    if (index > -1) {
      const product = this.products.find((p) => p.id === item.product_id);
      if (product) {
        product.numberProduct += item.quantity; // Trả lại số lượng vào tồn kho
      }
      this.selectedOrder.items.splice(index, 1); // Xóa sản phẩm khỏi hóa đơn
      this.calculateTotalMoney(); // Tính lại tổng tiền
      this.saveOrdersToLocalStorage(); // Lưu vào localStorage
      Swal.fire('Success', 'Sản phẩm đã được xóa khỏi hóa đơn.', 'success');
    }
  }

  // Thanh toán hóa đơn
  processPayment(): void {
    if (!this.selectedOrder) {
      Swal.fire('Warning', 'Vui lòng chọn hóa đơn để thanh toán.', 'warning');
      return;
    }

    if (this.change < 0) {
      Swal.fire('Error', 'Số tiền khách đưa không đủ để thanh toán!', 'error');
      return;
    }

    Swal.fire({
      title: 'Xác nhận thanh toán',
      text: `Thanh toán hóa đơn ${this.selectedOrder.id} với tổng tiền ${this.selectedOrder.totalMoney} VND?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Thanh toán',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        const orderData = {
          userId: 10,
          fullname: 'Khách hàng tại quầy',
          phoneNumber: 'Không xác định',
          address: 'Tại quầy',
          totalMoney: this.selectedOrder.totalMoney,
          amountGiven: this.amountGiven,
          change: this.change,
          items: this.selectedOrder.items.map((item: { product_id: number; quantity: number; price: number }) => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),          
        };        
        console.log('Dữ liệu gửi lên:', orderData);
        

        // Gọi trực tiếp API lưu hóa đơn không qua service
        this.http.post(`${environment.apiBaseurl}/counter-orders/create`, orderData).subscribe({
          next: (response) => {
            Swal.fire('Success', `Hóa đơn ${this.selectedOrder.id} đã được thanh toán và lưu vào hệ thống!`, 'success');
            this.waitingOrders = this.waitingOrders.filter(
              (order) => order !== this.selectedOrder
            );
            this.selectedOrder = null;
            this.saveOrdersToLocalStorage();
          },
          error: (error) => {
            console.error('Lỗi khi lưu hóa đơn:', error);
            Swal.fire('Error', 'Lưu hóa đơn thất bại! Vui lòng thử lại.', 'error');
          },
        });
      }
    });
  }
}
