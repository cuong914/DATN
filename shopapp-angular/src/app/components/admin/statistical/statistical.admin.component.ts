import { Component } from "@angular/core";
import { ChartData, ChartOptions } from "chart.js";
import { NgChartsModule } from "ng2-charts";
// import { NgChartsModule, ChartsModule } from 'ng2-charts';


@Component({
    selector: 'app-statistical-admin',
    templateUrl: './statistical.admin.component.html',
    styleUrls: [
      './statistical.admin.component.scss',        
    ],
    standalone: true,
    imports: [NgChartsModule],
  })

export class StatisticalAdminComponent{
 // Dữ liệu cho biểu đồ
//  public salesData: ChartData<'bar'> = {
//     labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
//     datasets: [
//       {
//         label: 'Doanh số (Triệu VND)',
//         data: [50, 100, 75, 200, 150, 300], // Thay bằng dữ liệu từ API
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1
//       }
//     ]
//   };

//   // Cấu hình biểu đồ
//   public chartOptions: ChartOptions<'bar'> = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       tooltip: {
//         callbacks: {
//           label: (context) => `${context.raw} Triệu VND`
//         }
//       }
//     },
//     scales: {
//       x: {
//         beginAtZero: true
//       },
//       y: {
//         beginAtZero: true
//       }
//     }
//   };

//   constructor() { }

//   ngOnInit(): void {
//     // Gọi API để lấy dữ liệu (nếu cần)
//     // this.loadSalesData();
//   }

//   Hàm ví dụ để tải dữ liệu từ API
//   private loadSalesData(): void {
//     this.salesService.getSalesData().subscribe(data => {
//       this.salesData.datasets[0].data = data.sales;
//       this.salesData.labels = data.months;
//     });
  // }

  // Dữ liệu cho biểu đồ
//   public lineChartData = [
//     { data: [10, 20, 30, 40, 50], label: 'Doanh số bán hàng' }
//   ];

//   // Nhãn cho trục X
//   public lineChartLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'];

//   // Tùy chọn biểu đồ
//   public lineChartOptions = {
//     responsive: true,
//   };

//   public lineChartLegend = true;  // Hiển thị chú thích
//   public lineChartType = 'line' as const; // Loại biểu đồ



public chartData: ChartData<'pie'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56],
        label: 'Sales Data',
        backgroundColor: '#42A5F5',
      }
    ]
  };

  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    }
  };

  public chartType: 'bar' | 'line' | 'pie' = 'bar';  // Định nghĩa loại biểu đồ


}