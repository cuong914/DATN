import { Component ,OnInit  } from "@angular/core";
import { ChartData, ChartOptions } from "chart.js";
import { StatisticsService } from '../../../service/statistics.service';
import { NgChartsModule } from "ng2-charts";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-statistical-admin',
    templateUrl: './statistical.admin.component.html',
    styleUrls: [
      './statistical.admin.component.scss',        
    ],
    standalone: true,
    imports: [NgChartsModule,CommonModule,FormsModule],
  })

export class StatisticalAdminComponent implements OnInit {
    startDate: string = '';
    endDate: string = '';
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
    
      ngOnInit(): void {
          this.loadTopSellingProducts();
          this.loadOrderStatistics();
      }
      loadOrderStatisticssearch(): void {
        if (this.startDate && this.endDate) {
          const formattedStartDate = this.startDate + "T00:00:00";
          const formattedEndDate = this.endDate + "T23:59:59";
      
          this.statisticsService.getOrderStatistic(formattedStartDate, formattedEndDate).subscribe(
            data => {
              this.deliveredOrders = data.deliveredOrders;
              this.pendingOrders = data.pendingOrders;
              this.cancelledOrders = data.cancelledOrders;
              this.totalRevenue = data.totalRevenue;
              
              // Cập nhật dữ liệu sản phẩm bán chạy khi lọc
              if (data.topProductsData) {
                this.topProductsData = {
                  labels: data.topProductsData.map((item: { productName: string }) => item.productName),
                  datasets: [{
                    label: 'Số lượng đã bán',
                    data: data.topProductsData.map((item: { totalSold: number }) => item.totalSold),
                    backgroundColor: '#4CAF50'
                  }]
                };
                this.productDetails = data.topProductsData;
              } else {
                console.warn('Không có dữ liệu sản phẩm bán chạy trong phạm vi lọc.');
                this.topProductsData = { labels: [], datasets: [] };
                this.productDetails = [];
              }
            },
            error => {
              console.error('Error fetching order statistics:', error);
            }
          );
        }
      }
      
    loadOrderStatistics(): void {
        this.statisticsService.getOrderStatisticsss().subscribe(
          data => {
            this.deliveredOrders = data.deliveredOrders;
            this.pendingOrders = data.pendingOrders;
            this.cancelledOrders = data.cancelledOrders;
            this.totalRevenue = data.totalRevenue;
          },
          error => {
            console.error('Error fetching order statistics:', error);
          }
        );
      }
      
    loadTopSellingProducts(): void {
        this.statisticsService.getTopSellingProducts().subscribe(
          data => {
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
          },
          error => {
            console.error('Lỗi khi lấy sản phẩm bán chạy:', error);
          }
        );
      }
}
