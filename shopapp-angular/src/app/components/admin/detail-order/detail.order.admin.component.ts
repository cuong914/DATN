import { ActivatedRoute, Router } from "@angular/router";
import { OrderDTO } from "../../../dtos/order/order_dto";
import { environment } from "../../../environments/environments";
import { OrderService } from "../../../service/order.service";
import { OrderResponse } from "../../../responses/order/order.response";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, NgModel } from "@angular/forms";
import { CommonModule } from "@angular/common";
import Swal from 'sweetalert2';
@Component({
    selector: 'app-detail-order-admin',
    templateUrl: './detail.order.admin.component.html',
    styleUrls: ['./detail.order.admin.component.scss'],
    standalone: true,
    imports: [CommonModule,FormsModule]
  })
  
  export class DetailOrderAdminComponent implements OnInit{    
    orderId:number = 0;
    orderResponse: OrderResponse = {
      id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
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
      order_details: [],
      
    };  
    statusList: string[] = [
      'Chuẩn Bị',
      'Vận Chuyển',
      'Nhận Hàng',
      'Đã Nhận',
      'Hủy'
    ];
    private orderService = inject(OrderService);

    constructor(    
      private route: ActivatedRoute,
      private router: Router
      ) {}
  
    ngOnInit(): void {
      this.getOrderDetails();
    }
    validateStatus(event: Event): void {
      const newStatus = (event.target as HTMLSelectElement).value;
    
      // Danh sách các trạng thái hợp lệ theo thứ tự
      const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      const currentIndex = statusOrder.indexOf(this.orderResponse.status);
      const selectedIndex = statusOrder.indexOf(newStatus);
    
      // Kiểm tra nếu trạng thái được chọn không hợp lệ hoặc bỏ qua bước
      if (selectedIndex !== -1 && selectedIndex > currentIndex + 1) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể bỏ qua bước trạng thái!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
    
        // Trả trạng thái về giá trị trước đó
        this.orderResponse.status = statusOrder[currentIndex];
        return;
      }
    
      // Kiểm tra nếu trạng thái chuyển sang "Hủy"
      if (newStatus === 'cancelled') {
        this.orderService.cancelOrder(this.orderResponse.id).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Thành công!',
              text: 'Số lượng sản phẩm đã được cập nhật lại về kho.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          error: (error) => {
            console.error('Error updating stock:', error);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Có lỗi xảy ra khi cập nhật kho.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    
      // Cập nhật trạng thái hiện tại nếu hợp lệ
      this.orderResponse.status = newStatus;
    }

    getOrderDetails(): void {
      this.orderId = Number(this.route.snapshot.paramMap.get('id'));
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (response: any) => {
          this.orderResponse.id = response.id;
          this.orderResponse.user_id = response.user_id;
          this.orderResponse.fullname = response.fullname;
          this.orderResponse.email = response.email;
          this.orderResponse.phone_number = response.phone_number;
          this.orderResponse.address = response.address;
          this.orderResponse.note = response.note;
          this.orderResponse.total_money = response.total_money;
          this.orderResponse.order_date = new Date(response.order_date);
          this.orderResponse.order_details = response.order_details.map((order_detail: any) => {
            order_detail.product.thumbnail = `${environment.apiBaseurl}/products/images/${order_detail.product.thumbnail}`;
            order_detail.number_of_products = order_detail.numberOfProducts;
            return order_detail;
          });
    
          this.orderResponse.payment_method = response.payment_method;
          if (response.shipping_date) {
            this.orderResponse.shipping_date = new Date(
              response.shipping_date[0],
              response.shipping_date[1] - 1,
              response.shipping_date[2]
            );
          }
    
          this.orderResponse.shipping_method = response.shipping_method;
          
          // Gán trạng thái mặc định là "Chuẩn Bị" nếu chưa có
          this.orderResponse.status = response.status || 'Chuẩn Bị';
        },
        error: (error: any) => {
          console.error('Error fetching detail:', error);
        },
      });
    }    
    printOrder() {
      const printContent = `
        <html>
          <head>

            <style>
              @media print {
                @page {
                  size: 10mm auto;
                  margin: 10mm; /* Lề */
                }
                body {
                  font-family: 'Times New Roman', serif;
                  font-size: 14px;
                  margin: 0;
                  text-align: center;
                }
                .invoice-box {
                  width: 60mm;  /* Chiều rộng giống máy in hóa đơn */
                  margin: auto;
                  padding: 10px;
                  border: 1px solid #ddd;
                  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                }
                .header {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
                .address {
                  font-size: 12px;
                  margin-bottom: 20px;
                }
                .line {
                  border-bottom: 1px dashed #000;
                  margin: 10px 0;
                }
                .info {
                  text-align: left;
                  margin: 20px 0;
                }
                .total {
                  text-align: right;
                  font-weight: bold;
                  margin-top: 10px;
                }
                .footer {
                  margin-top: 20px;
                  font-style: italic;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-box">
              <div class="header">TESS</div>
              <div class="address">
                Địa Chỉ: Tòa Nhà FPT Polytechnic, Phố Trịnh Văn Bô, Nam Từ Liêm, Hà Nội<br>
                Điện Thoại: (024) 1234567
              </div>
              <div class="line"></div>
              <div class="header">HÓA ĐƠN</div>
              <div class="info">
                Mã HĐ: ${this.orderResponse.id} <br>
                Ngày: ${new Date(this.orderResponse.order_date).toLocaleDateString()}
              </div>
              <div class="line"></div>
    
              <table width="100%" cellpadding="5">
                <tr>
                  <th align="left">Sản Phẩm</th>
                  <th align="center">SL</th>
                  <th align="right">Giá</th>
                </tr>
                ${this.orderResponse.order_details.map((detail: any) => `
                  <tr>
                    <td>${detail.product.name}</td>
                    <td align="center">${detail.number_of_products}</td>
                    <td align="right">${(detail.product.price * detail.number_of_products).toLocaleString()} VND</td>
                  </tr>
                `).join('')}
              </table>
              
              <div class="line"></div>
              <div class="total">
                Tổng: ${this.orderResponse.order_details.reduce((sum: any, detail: any) => sum + (detail.product.price * detail.number_of_products), 0).toLocaleString()} VND
              </div>
              
              <div class="footer">
                Cảm ơn quý khách!
              </div>
            </div>
          </body>
        </html>
      `;
      
    
      const printWindow = window.open('', '', 'width=900,height=600');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
          }, );
        },100);
      }
    }
    canSelectStatus(status: string): boolean {
      const currentIndex = this.statusList.indexOf(this.orderResponse.status);
      const statusIndex = this.statusList.indexOf(status);
      return statusIndex === currentIndex || statusIndex === currentIndex + 1;
    }
    saveOrder(): void {    
      this.orderService
        .updateOrder(this.orderId, new OrderDTO(this.orderResponse))
        .subscribe({
          next: (response: Object) => {
            Swal.fire({
              title: 'Thành Công!',
              text: 'Hóa đơn đã được cập nhật.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/admin/orders']);
            });
          },
          error: (error: any) => {
            Swal.fire({
              title: 'Lỗi!',
              text: 'Cập nhật hóa đơn thất bại.',
              icon: 'error',
              confirmButtonText: 'Thử Lại'
            });
          }
        });   
    }
  }