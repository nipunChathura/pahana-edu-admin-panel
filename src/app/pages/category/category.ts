import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterOutlet } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryDto } from '../../services/dto/CategoryDto';
import { CategoryApiResponse } from '../../services/response/CategoryApiResponse';
import { CategoryService } from '../../services/category';
import { Auth } from '../../services/auth';
import { MatDialog } from '@angular/material/dialog';
import { CategoryAddDialog } from './category-add-dialog/category-add-dialog';
import { CategoryUpdateDialog } from './category-update-dialog/category-update-dialog';
import { CategoryDeleteDialog } from './category-delete-dialog/category-delete-dialog';
import { FormsModule } from '@angular/forms';
import {CategoryRequest} from '../../services/request/CategoryRequest';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterOutlet,
    MatPaginatorModule,
    MatFormField,
    MatFormField,
    MatInput,
    MatSuffix,
    MatFormField,
    MatSelectModule,
    MatOption,
    MatSelect,
    MatOption,
    FormsModule,
  ],
  templateUrl: './category.html',
  styleUrls: ['./category.scss'],
})
export class Category {
  allColumns: string[] = ['action', 'id', 'name', 'status'];

  categories!: CategoryDto[];
  response!: CategoryApiResponse;
  searchText: string = '';
  selectedStatus: string = '';

  dataSource = new MatTableDataSource<CategoryDto>(this.categories);

  private token;
  private userId = 1;

  constructor(
    private categoryService: CategoryService,
    private auth: Auth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.token = this.auth.getToken() ?? '';
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadCategoryTableData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadCategoryTableData() {
    this.categoryService.getCategories(this.userId, this.token).subscribe(data => {
      this.response = data;
      this.categories = this.response.categoryDetailsList;
      this.dataSource = new MatTableDataSource<CategoryDto>(this.categories);

      // Combined filter for search and status
      this.dataSource.filterPredicate = (data: CategoryDto, filter: string) => {
        const filterObj = JSON.parse(filter);
        const matchesText = (data.categoryName ?? '').toLowerCase().includes(filterObj.searchText);
        const matchesStatus = filterObj.selectedStatus === '' || data.categoryStatus === filterObj.selectedStatus;
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

  onAddCategory(): void {
    const dialogRef = this.dialog.open(CategoryAddDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategoryTableData();
      }
    });
  }

  onEdit(category: any): void {
    const dialogRef = this.dialog.open(CategoryUpdateDialog, {
      width: '400px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategoryTableData();
      }
    });
  }

  onDelete(element: any): void {
    const dialogRef = this.dialog.open(CategoryDeleteDialog, {
      width: '350px',
      data: { category: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteCategory(element);
      }
    });
  }

  deleteCategory(category: any): void {
    const categoryDto: CategoryDto = {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      categoryStatus: category.categoryStatus
    };

    const request: CategoryRequest = {
      userId: this.userId,
      categoryId: category.categoryId,
      categoryDetail: categoryDto
    };

    this.categoryService.deleteCategory(request, this.token).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.snackBar.open('Category delete successfully', 'Close', { duration: 3000, panelClass: ['snack-info'], horizontalPosition: 'center', verticalPosition: 'top' });
          this.loadCategoryTableData();
        } else {
          this.snackBar.open('Category delete Error ' + response.responseMessage, 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
        }
      },
      error: (err) => {
        this.snackBar.open('Failed to delete category', 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
        console.error('Save error:', err);
      }
    });
  }
}

