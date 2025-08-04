import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {MatToolbar} from "@angular/material/toolbar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";
import {Auth} from '../../services/auth';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatPaginator} from '@angular/material/paginator';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatSelect} from '@angular/material/select';
import {CustomerDto} from '../../services/dto/CustomerDto';
import {CustomerResponse} from '../../services/response/CustomerResponse';
import {CustomerService} from '../../services/customer';
import {AddCustomer} from './add-customer/add-customer';
import {UpdateCustomer} from './update-customer/update-customer';
import {DeleteCustomer} from './delete-customer/delete-customer';
import {CustomerRequest} from '../../services/request/CustomerRequest';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, MatButton, MatCell, MatCellDef, MatColumnDef, MatFormField, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatIcon, MatIconButton, MatInput, MatLabel, MatOption, MatPaginator, MatRow, MatRowDef, MatSelect, MatSuffix, MatTable, MatToolbar, ReactiveFormsModule, RouterOutlet, FormsModule, MatHeaderCellDef],
  templateUrl: './customer.html',
  styleUrl: './customer.scss'
})
export class Customer {
  allColumns: string[] = ['action', 'id', 'name', 'phoneNumber', 'email', 'memberShip', 'status'];

  customers!: CustomerDto[];
  response!: CustomerResponse;
  searchText: string = '';
  selectedStatus: string = '';

  dataSource = new MatTableDataSource<CustomerDto>(this.customers);

  private token;
  private userId = 1;

  constructor(
    private customerService: CustomerService,
    private auth: Auth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.token = this.auth.getToken() ?? '';
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadCustomerTableData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadCustomerTableData() {
    this.customerService.getCustomer(this.userId, this.token).subscribe(data => {
      this.response = data;
      this.customers = this.response.customerDtoList;
      this.dataSource = new MatTableDataSource<CustomerDto>(this.customers);

      // Combined filter for search and status
      this.dataSource.filterPredicate = (data: CustomerDto, filter: string) => {
        const filterObj = JSON.parse(filter);
        const matchesText = (data.customerName ?? '').toLowerCase().includes(filterObj.searchText);
        const matchesStatus = filterObj.selectedStatus === '' || data.status === filterObj.selectedStatus;
        return matchesText && matchesStatus;
      };

      this.dataSource.paginator = this.paginator;
      this.applyCombinedFilter(); // Apply filter after loading data
    });
  }

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyCombinedFilter();
  }

  clearSearch() {
    this.searchText = '';
    this.applyCombinedFilter();
  }

  applyStatusFilter() {
    this.applyCombinedFilter();
  }

  applyCombinedFilter() {
    const filterValue = {
      searchText: this.searchText.toLowerCase(),
      selectedStatus: this.selectedStatus
    };
    this.dataSource.filter = JSON.stringify(filterValue);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAddCustomer(): void {
    const dialogRef = this.dialog.open(AddCustomer, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCustomerTableData();
      }
    });
  }

  onEdit(customer: any): void {
    console.log(customer)
    const dialogRef = this.dialog.open(UpdateCustomer, {
      width: '600px',
      data: customer
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCustomerTableData();
      }
    });
  }

  onDelete(element: any): void {
    const dialogRef = this.dialog.open(DeleteCustomer, {
      width: '500px',
      data: { customer: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteCustomer(element);
      }
    });
  }

  deleteCustomer(customer: any): void {
    const customerDto: CustomerDto = {
      customerId: customer.customerId,
      customerRegNo: customer.customerRegNo,
      customerName: customer.customerName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      membershipType: customer.membershipType,
      status: customer.status
    };

    const request: CustomerRequest = {
      userId: this.userId,
      customerId: customer.customerId,
      customerDto: customerDto
    };

    this.customerService.deleteCustomer(request, this.token).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.snackBar.open('Customer delete successfully', 'Close', { duration: 3000, panelClass: ['snack-info'], horizontalPosition: 'center', verticalPosition: 'top' });
          this.loadCustomerTableData();
        } else {
          this.snackBar.open('Customer delete Error ' + response.responseMessage, 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
        }
      },
      error: (err) => {
        this.snackBar.open('Failed to delete customer', 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
        console.error('Save error:', err);
      }
    });
  }

  getMembershipClass(type: string): string {
    switch (type) {
      case 'GOLD':
        return 'membership-gold';
      case 'SILVER':
        return 'membership-silver';
      case 'BRONZE':
        return 'membership-bronze';
      default:
        return 'membership-default';
    }
  }
}
