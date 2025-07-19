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

  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNzUyOTI3ODg4LCJleHAiOjE3NTMwMTQyODh9.8Hz0E32JxcDlN_kihL4J2oycT6VNRhU4kU5oKXg3zOs'; // Replace or get from auth service
  private userId = 1;

  constructor(private categoryService: CategoryService) {}

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

  onEdit(element: CategoryDto): void {
    console.log('Edit clicked for:', element);
  }

  onDelete(element: CategoryDto): void {
    console.log('Delete clicked for:', element);
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
}
