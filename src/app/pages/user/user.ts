import {Component, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatToolbar} from '@angular/material/toolbar';
import {AddUser} from './add-user/add-user';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {RouterOutlet} from '@angular/router';
import {UserService} from '../../services/user';
import {Auth} from '../../services/auth';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatPaginator} from '@angular/material/paginator';
import {UpdateUser} from './update-user/update-user';
import {DeleteUser} from './delete-user/delete-user';
import {NgClass, NgIf} from '@angular/common';
import {UserResponse} from '../../services/response/UserResponse';
import {UserDto} from '../../services/dto/UserDto';
import {UserRequest} from '../../services/request/UserRequest';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    MatToolbar,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    RouterOutlet,
    NgClass,
    MatHeaderCellDef,
    NgIf
  ],
  templateUrl: './user.html',
  styleUrls: ['./user.scss']
})
export class User {
  allColumns: string[] = ['action', 'id', 'username', 'role', 'status'];

  users!: UserDto[];
  response!: UserResponse;
  searchText: string = '';
  selectedStatus: string = '';

  dataSource = new MatTableDataSource<UserDto>(this.users);

  private token;
  private userId = 1;

  constructor(
    private userService: UserService,
    private auth: Auth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.token = this.auth.getToken() ?? '';
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadUserTableData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadUserTableData() {
    this.userService.getUsers(this.userId, this.token).subscribe(data => {
      this.response = data;
      this.users = this.response.userDtos;
      this.dataSource = new MatTableDataSource<UserDto>(this.users);

      // Combined filter for search and status
      this.dataSource.filterPredicate = (data: UserDto, filter: string) => {
        const filterObj = JSON.parse(filter);
        const matchesText = (data.username ?? '').toLowerCase().includes(filterObj.searchText);
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

  onAddUser(): void {
    const dialogRef = this.dialog.open(AddUser, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserTableData();
      }
    });
  }

  onEdit(user: any): void {
    const dialogRef = this.dialog.open(UpdateUser, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserTableData();
      }
    });
  }

  onDelete(element: any): void {
    const dialogRef = this.dialog.open(DeleteUser, {
      width: '350px',
      data: { user: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteUser(element);
      }
    });
  }

  deleteUser(user: any): void {

    this.userService.deleteUser(user.userId, this.token).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.snackBar.open('User delete successfully', 'Close', { duration: 3000, panelClass: ['snack-info'], horizontalPosition: 'center', verticalPosition: 'top' });
          this.loadUserTableData();
        } else {
          this.snackBar.open('User delete Error ' + response.responseMessage, 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
        }
      },
      error: (err) => {
        this.snackBar.open('Failed to delete User', 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
        console.error('Save error:', err);
      }
    });
  }
}
