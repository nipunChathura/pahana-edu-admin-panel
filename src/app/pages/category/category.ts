import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterOutlet } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatFormField, MatInput, MatSuffix} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryDto } from '../../services/dto/CategoryDto';
import { CategoryApiResponse } from '../../services/response/CategoryApiResponse';
import { CategoryService } from '../../services/category';
import { Auth } from '../../services/auth';
import {MatDialog} from '@angular/material/dialog';
import {CategoryAddDialog} from './category-add-dialog/category-add-dialog';
import {CategoryUpdateDialog} from './category-update-dialog/category-update-dialog';
import {CategoryDeleteDialog} from './category-delete-dialog/category-delete-dialog';

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
  ],
  templateUrl: './category.html',
  styleUrls: ['./category.scss'],
})
export class Category {
  allColumns: string[] = ['action', 'id', 'name', 'status'];

  categories!: CategoryDto[];
  response!: CategoryApiResponse;

  dataSource = new MatTableDataSource<CategoryDto>(this.categories);

  private token ;
  private userId = 1;

  constructor(private categoryService: CategoryService, private auth: Auth, private dialog: MatDialog) {
    this.token = this.auth.getToken() ?? '';
  }

  ngOnInit() {
    this.categoryService.getCategories(this.userId, this.token).subscribe(data => {
      this.response = data;
      console.log(this.response.categoryDetailsList)
      this.categories = this.response.categoryDetailsList
      this.dataSource = new MatTableDataSource<CategoryDto>(this.categories);

      this.dataSource.filterPredicate = (data: CategoryDto, filter: string) => {
        return filter === '' || data.categoryStatus === filter;
      };

      this.dataSource.filterPredicate = (data, filter) => {
        // default filter on categoryName property only (example)
        return data.categoryName.toLowerCase().includes(filter);
      };

      this.dataSource.paginator = this.paginator;
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onEdit(category: any): void {
    const dialogRef = this.dialog.open(CategoryUpdateDialog, {
      width: '400px',
      data: category  // Pass selected row data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  loadCategories(): void {
    // Your actual delete logic here
    console.log('Loading Data');
    // Example: this.categoryService.delete(category.id).subscribe(...)
  }

  onDelete(element: any): void {
    const dialogRef = this.dialog.open(CategoryDeleteDialog, {
      width: '350px',
      data: { category: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Proceed with delete
        this.deleteCategory(element);
      }
    });
  }

  deleteCategory(category: any): void {
    // Your actual delete logic here
    console.log('Deleting:', category);
    // Example: this.categoryService.delete(category.id).subscribe(...)
  }

  selectedStatus: string = '';

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch() {
    this.dataSource.filter = '';
  }

  applyStatusFilter() {
    this.dataSource.filter = this.selectedStatus.trim();
  }

  onAddCategory(): void {
    const dialogRef = this.dialog.open(CategoryAddDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New category:', result);
      }
    });
  }
}
