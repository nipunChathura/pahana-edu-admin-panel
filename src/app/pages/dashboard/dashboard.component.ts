// import { Component, OnInit } from "@angular/core";
// import {
//   ChartComponent,
//   ApexAxisChartSeries,
//   ApexNonAxisChartSeries,
//   ApexChart,
//   ApexXAxis,
//   ApexYAxis,
//   ApexDataLabels,
//   ApexStroke,
//   ApexGrid,
//   ApexTitleSubtitle,
//   ApexResponsive,
//   ApexFill,
//   ApexTooltip
// } from "ng-apexcharts";
// import { Auth } from '../../services/auth';
// import { DashboardService } from '../../services/dashboard.service';
// import { DashboardResponse } from '../../services/response/DashboardResponse';
//
// export type ChartOptions = {
//   series: ApexAxisChartSeries | ApexNonAxisChartSeries;
//   chart: ApexChart;
//   xaxis?: ApexXAxis;
//   yaxis?: ApexYAxis | ApexYAxis[];
//   tooltip?: ApexTooltip;
//   dataLabels?: ApexDataLabels;
//   stroke?: ApexStroke;
//   grid?: ApexGrid;
//   title?: ApexTitleSubtitle;
//   responsive?: ApexResponsive[];
//   labels?: string[];
//   fill?: ApexFill;
// };
//
// @Component({
//   selector: "app-dashboard",
//   standalone: true,
//   templateUrl: "./dashboard.component.html",
//   imports: [ChartComponent],
//   styleUrls: ["./dashboard.component.scss"]
// })
// export class DashboardComponent implements OnInit {
//
//   userId: number;
//   token!: string;
//   dashboardData?: DashboardResponse;
//
//   // Chart options
//   public incomeChart: ChartOptions = {
//     series: [],
//     chart: { type: "area", height: 300 },
//     xaxis: { categories: [] },
//     yaxis: {
//       title: { text: "Income (LKR)" },
//       labels: {
//         formatter: (val: number) => "LKR " + val.toLocaleString()
//       }
//     },
//     tooltip: {
//       y: { formatter: (val: number) => "LKR " + val.toLocaleString() }
//     }
//   };
//
//   public orderChart: ChartOptions = {
//     series: [],
//     chart: { type: "line", height: 300 },
//     xaxis: { categories: [] }
//   };
//
//   public membershipChart: ChartOptions = {
//     series: [],
//     chart: { type: "bar", height: 300 },
//     xaxis: { categories: [] }
//   };
//
//   public bookChart: ChartOptions = {
//     series: [],
//     chart: { type: "radialBar", height: 300 },
//     labels: []
//   };
//
//   constructor(private dashboardService: DashboardService, private auth: Auth) {
//     this.token = this.auth.getToken() ?? '';
//     this.userId = Number(localStorage.getItem('userId') ?? '');
//   }
//
//   ngOnInit(): void {
//     this.loadDashboardData();
//   }
//
//   private loadDashboardData(): void {
//     this.dashboardService.getDashboardData(this.userId, this.token).subscribe({
//       next: res => {
//         if (res.status === 'success') {
//           this.dashboardData = res;
//
//           // Process API data
//           const incomes = this.dashboardData.dashboardDetails.incomes;
//           const orders = this.dashboardData.dashboardDetails.orderCount;
//           const members = this.dashboardData.dashboardDetails.membershipCount;
//           const books = this.dashboardData.dashboardDetails.popularBookStock;
//
//           // Update chart data
//           this.incomeChart = {
//             ...this.incomeChart,
//             series: [{ name: 'Income', data: Object.values(incomes) }],
//             xaxis: { categories: Object.keys(incomes) }
//           };
//
//           this.orderChart = {
//             ...this.orderChart,
//             series: [{ name: 'Orders', data: Object.values(orders) }],
//             xaxis: { categories: Object.keys(orders) }
//           };
//
//           this.membershipChart = {
//             ...this.membershipChart,
//             series: [{ name: 'Customers', data: Object.values(members) }],
//             xaxis: { categories: Object.keys(members) }
//           };
//
//           this.bookChart = {
//             ...this.bookChart,
//             series: Object.values(books),
//             labels: Object.keys(books)
//           };
//         }
//       },
//       error: err => console.error('Dashboard Data Getting failed', err)
//     });
//   }
// }

import { Component, OnInit } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexTitleSubtitle,
  ApexResponsive,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  tooltip?: ApexTooltip;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  grid?: ApexGrid;
  title?: ApexTitleSubtitle;
  responsive?: ApexResponsive[];
  labels?: string[];
  fill?: ApexFill;
};

@Component({
  selector: "app-dashboard",
  standalone: true,
  templateUrl: "./dashboard.component.html",
  imports: [ChartComponent],
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {

  // Hardcoded data
  weekDays: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  incomeList: number[] = [1200, 2000, 1500, 3000, 2500, 4000, 3500];
  orderCountList: number[] = [10, 20, 15, 25, 22, 30, 28];
  customerMembershipList: string[] = ["Silver", "Gold", "Platinum", "Diamond"];
  customerCountList: number[] = [44, 55, 41, 17];
  bookNameList: string[] = ["Book A", "Book B", "Book C", "Book D"];
  bookAvailabilityList: number[] = [70, 55, 40, 85];

  // Income - Area Chart
  public incomeChart: ChartOptions = {
    series: [{ name: "Income", data: this.incomeList }],
    chart: { type: "area", height: 300 },
    xaxis: { categories: this.weekDays },
    yaxis: {
      title: { text: "Income (LKR)" },
      labels: {
        formatter: (val: number) => "LKR " + val.toLocaleString()
      }
    },
    tooltip: {
      y: { formatter: (val: number) => "LKR " + val.toLocaleString() }
    }
  };

  // Membership - Bar Chart
  public membershipChart: ChartOptions = {
    series: [{ name: "Customers", data: this.customerCountList }],
    chart: { type: "bar", height: 300 },
    xaxis: { categories: this.customerMembershipList }
  };

  // Orders - Line Chart
  public orderChart: ChartOptions = {
    series: [{ name: "Orders", data: this.orderCountList }],
    chart: { type: "line", height: 300 },
    xaxis: { categories: this.weekDays }
  };

  // Books - Radial Chart
  public bookChart: ChartOptions = {
    series: this.bookAvailabilityList,
    chart: { type: "radialBar", height: 300 },
    labels: this.bookNameList
  };

  ngOnInit(): void {
    // All data already initialized with variables
  }
}
