import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatInput} from '@angular/material/input';
import {Auth} from '../../services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OrderService} from '../../services/order.service';
import {OrderDto} from '../../services/dto/OrderDto';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbar,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    CurrencyPipe,
    DatePipe,
    NgIf,
    MatInput
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, AfterViewInit {
  // orders: OrderDto[] = [];
  // searchText: string = '';
  // selectedStatus: string = '';
  // expandedOrder: OrderDto | null = null;
  //
  // displayedColumns: string[] = ['orderId', 'customerName', 'orderDate', 'paidAmount', 'paymentType', 'status', 'expand'];
  // innerDisplayedColumns: string[] = ['bookName', 'author', 'itemPrice', 'itemQuantity', 'discountPrice', 'promotion'];
  //
  // dataSource!: MatTableDataSource<OrderDto>;
  // userId: number = 1;
  // token!: string;
  //
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  //
  // constructor(
  //   private auth: Auth,
  //   private snackBar: MatSnackBar,
  //   private orderService: OrderService
  // ) {
  //   this.token = this.auth.getToken() ?? '';
  // }
  //
  // ngOnInit(): void {
  //   this.getOrders();
  // }
  //
  // getOrders(): void {
  //   this.orderService.getOrders(this.userId, true, this.token).subscribe({
  //     next: response => {
  //       console.log(response)
  //       if (response.status === 'success') {
  //         this.orders = response.orderList;
  //         this.dataSource = new MatTableDataSource<OrderDto>(this.orders);
  //       } else {
  //         console.error('Error loading orders', response.responseMessage);
  //         this.orders = [];
  //         this.dataSource = new MatTableDataSource<OrderDto>([]);
  //       }
  //     },
  //     error: err => {
  //       console.error('Error loading orders', err);
  //       this.orders = [];
  //       this.dataSource = new MatTableDataSource<OrderDto>([]);
  //     }
  //   });
  // }
  //
  // ngAfterViewInit(): void {
  //   if (this.dataSource) {
  //     this.dataSource.paginator = this.paginator;
  //   }
  // }
  //
  // toggleRow(order: OrderDto): void {
  //   this.expandedOrder = this.expandedOrder === order ? null : order;
  // }
  //
  // applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  //   this.dataSource.filter = filterValue;
  // }
  //
  // applyStatusFilter(): void {
  //   if (this.selectedStatus) {
  //     this.dataSource.data = this.orders.filter(order => order.customer.status === this.selectedStatus);
  //   } else {
  //     this.dataSource.data = [...this.orders];
  //   }
  // }
  //
  // clearSearch(): void {
  //   this.searchText = '';
  //   this.dataSource.data = [...this.orders];
  // }

  orders: OrderDto[] = [];
  searchText: string = '';
  selectedStatus: string = '';
  expandedOrder: OrderDto | null = null;

  displayedColumns: string[] = ['orderId', 'customerName', 'orderDate', 'paidAmount', 'paymentType', 'status', 'expand'];
  innerDisplayedColumns: string[] = ['bookName', 'author', 'itemPrice', 'itemQuantity', 'discountPrice', 'promotion'];

  dataSource!: MatTableDataSource<OrderDto>;
  userId: number ;
  token!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private auth: Auth,
    private snackBar: MatSnackBar,
    private orderService: OrderService
  ) {
    this.token = this.auth.getToken() ?? '';
    this.userId = Number(localStorage.getItem('userId') ?? '');
  }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getOrders(this.userId, true, this.token).subscribe({
      next: response => {
        if (response.status === 'success') {
          this.orders = response.orderList;

          // Initialize data source
          this.dataSource = new MatTableDataSource<OrderDto>(this.orders);

          // Custom filter for name, email, or phone
          this.dataSource.filterPredicate = (data: OrderDto, filter: string) => {
            const lowerFilter = filter.trim().toLowerCase();
            const name = data.customer?.customerName ?? '';
            const email = data.customer?.email ?? '';
            const phone = data.customer?.phoneNumber ?? '';

            return name.toLowerCase().includes(lowerFilter) ||
              email.toLowerCase().includes(lowerFilter) ||
              phone.toLowerCase().includes(lowerFilter);
          };
        } else {
          console.error('Error loading orders', response.responseMessage);
          this.orders = [];
          this.dataSource = new MatTableDataSource<OrderDto>([]);
        }
      },
      error: err => {
        console.error('Error loading orders', err);
        this.orders = [];
        this.dataSource = new MatTableDataSource<OrderDto>([]);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  toggleRow(order: OrderDto): void {
    this.expandedOrder = this.expandedOrder === order ? null : order;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }

  applyStatusFilter(): void {
    if (this.selectedStatus) {
      this.dataSource.data = this.orders.filter(order => order.customer.status === this.selectedStatus);
    } else {
      this.dataSource.data = [...this.orders];
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.dataSource.filter = '';
  }
}
