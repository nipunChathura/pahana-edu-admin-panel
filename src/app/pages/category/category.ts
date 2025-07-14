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

export interface PeriodicElement {
  id: number;
  name: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, name: 'Hydrogen', status: 'ACTIVE' },
  { id: 2, name: 'Helium', status: 'INACTIVE' },
  { id: 3, name: 'Lithium', status: 'ACTIVE' },
  { id: 4, name: 'Beryllium', status: 'INACTIVE' },
  { id: 5, name: 'Boron', status: 'ACTIVE' },
  { id: 6, name: 'Carbon', status: 'ACTIVE' },
];



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
  displayedColumns: string[] = ['id', 'name', 'status'];
  allColumns: string[] = ['action', 'id', 'name', 'status'];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onEdit(element: PeriodicElement): void {
    console.log('Edit clicked for:', element);
  }

  onDelete(element: PeriodicElement): void {
    console.log('Delete clicked for:', element);
  }

  selectedStatus: string = '';

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  clearSearch() {
    this.dataSource.filter = '';
  }

  applyStatusFilter() {
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      return this.selectedStatus === '' || data.status === this.selectedStatus;
    };
    // Re-apply the filter
    this.dataSource.filter = Math.random().toString(); // Force refresh
  }
}
