import { Component ,OnInit  } from "@angular/core";
import { ChartData, ChartOptions } from "chart.js";
import { StatisticsService } from '../../../service/statistics.service';
import { NgChartsModule } from "ng2-charts";
import { CommonModule } from '@angular/common';
// import { NgChartsModule, ChartsModule } from 'ng2-charts';


@Component({
    selector: 'app-statistical-admin',
    templateUrl: './statistical.admin.component.html',
    styleUrls: [
      './statistical.admin.component.scss',        
    ],
    standalone: true,
    imports: [NgChartsModule,CommonModule],
  })

export class StatisticalAdminComponent implements OnInit {
    public deliveredOrders: number = 0;
    public pendingOrders: number = 0;
    public cancelledOrders: number = 0;
    public totalRevenue: number = 0;
    public topProduct: string = 'Chưa có';

    public topProductsData: ChartData<'bar'>;
    public productDetails: any[] = [];

    public chartOptions: ChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        }
    };

    constructor(private statisticsService: StatisticsService) {
        this.topProductsData = { labels: [], datasets: [] };
    }

    ngOnInit() {
        this.loadOrderStatistics();
        this.loadTopSellingProducts();
    }

    // Load thống kê đơn hàng
    loadOrderStatistics() {
        this.statisticsService.getOrderStatistics().subscribe(data => {
            this.deliveredOrders = data.deliveredOrders;
            this.pendingOrders = data.pendingOrders;
            this.cancelledOrders = data.cancelledOrders;
            this.totalRevenue = data.totalRevenue;
        });
    }

    // Load sản phẩm bán chạy
    loadTopSellingProducts() {
      this.statisticsService.getTopSellingProducts().subscribe(data => {
          // Chỉ lấy top 6 sản phẩm đầu tiên
          const top6Products = data.slice(0, 6);
  
          this.topProductsData = {
              labels: top6Products.map((item: { productName: string }) => item.productName),
              datasets: [{
                  label: 'Số lượng đã bán',
                  data: top6Products.map((item: { totalSold: number }) => item.totalSold),
                  backgroundColor: '#4CAF50'
              }]
          };
  
          this.productDetails = top6Products;
      });
  }
  
}