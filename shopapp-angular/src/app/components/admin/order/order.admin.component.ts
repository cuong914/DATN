import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../../service/order.service";
import { OrderResponse } from "../../../responses/order/order.response";
import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Location } from "@angular/common";

@Component({
    selector: 'app-order-admin',
    templateUrl: './order.admin.component.html',
    styleUrls: ['./order.admin.component.scss'],
    standalone: true,
    imports: [NgClass,NgIf,NgFor,CommonModule,RouterModule,]
  })
 export class OrderAdminComponent implements OnInit{  
  orders: OrderResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 7;
  pages: number[] = [];
  totalPages:number = 0;
  keyword:string = "";
  visiblePages: number[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {

  }
  convertStatusToVietnamese(status: string): string {
    switch (status) {
      case 'cancelled':
        return 'Hủy';
      case 'pending':
        return 'Chuẩn Bị';
      case 'processing':
        return 'Vận Chuyển';
      case 'shipped':
        return 'Chờ Nhận Hàng';
      case 'delivered':
        return 'Đã Nhận';
      default:
        return 'Không xác định';
    }
  }
  
  ngOnInit(): void {
    this.getAllOrders(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }
  getAllOrders(keyword: string, page: number, limit: number) {
    this.orderService.getAllOrders(keyword, page - 1, limit).subscribe({
      next: (response: any) => {
        // Sắp xếp theo order_date giảm dần (mới nhất lên đầu)
        this.orders = response.orders.sort((a: any, b: any) => {
            return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
        });
        this.totalPages = response.totalPages;
        
        if (this.totalPages === 0) {
          this.totalPages = 1;
        }
        
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => {
        console.error('Lỗi khi tải hóa đơn:', error);
      }
    });
}

  onPageChange(page: number) {

    this.currentPage = page < 0 ? 0: page;
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }
  
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
}
  deleteOrder(id:number) {
    const confirmation = window
      .confirm('Are you sure you want to delete this order?');
    if (confirmation) {
      debugger
      this.orderService.deleteOrder(id).subscribe({
        next: (response: any) => {
          debugger 
          location.reload();          
        },
        complete: () => {
          debugger;          
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        }
      });    
    }
  }
  viewDetails(order:OrderResponse) {
    debugger
    this.router.navigate(['/admin/orders', order.id]);
  }
  
}