import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {CategoryDto} from '../../services/dto/CategoryDto';
import {Auth} from '../../services/auth';
import {CategoryAddDialog} from '../category/category-add-dialog/category-add-dialog';
import {CategoryDeleteDialog} from '../category/category-delete-dialog/category-delete-dialog';
import {CategoryRequest} from '../../services/request/CategoryRequest';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatPaginator} from '@angular/material/paginator';
import {BookDto} from '../../services/dto/BookDto';
import {BookResponse} from '../../services/response/BookResponse';
import {BookService} from '../../services/book';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {ViewBookDetail} from './view-book-detail/view-book-detail';
import {DeleteBook} from './delete-book/delete-book';
import {BookRequest} from '../../services/request/BookRequest';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterOutlet, MatToolbar, MatColumnDef, MatHeaderCell,
    MatCell, MatHeaderRow, MatRow, MatIconButton, MatTable, MatLabel, MatInput, MatSuffix, MatLabel, FormsModule,
    MatSelect, MatOption, MatFormField, MatHeaderCellDef, MatCellDef, MatPaginator, MatHeaderRowDef, MatRowDef,],
  templateUrl: './book.html',
  styleUrl: './book.scss'
})
export class Book {
  allColumns: string[] = ['action', 'id', 'isbn', 'name', 'categoryName', 'language', 'author', 'status'];

  books!: BookDto[];
  response!: BookResponse;
  searchText: string = '';
  selectedStatus: string = '';

  dataSource = new MatTableDataSource<BookDto>(this.books);

  private token;
  private userId;

  constructor(
    private bookService: BookService,
    private auth: Auth,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.token = this.auth.getToken() ?? '';
    this.userId = Number(localStorage.getItem('userId') ?? '');
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadBookTableData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadBookTableData() {
    this.bookService.getBooks(this.userId, this.token).subscribe(data => {
      this.response = data;
      this.books = this.response.bookDetailsList;
      this.dataSource = new MatTableDataSource<BookDto>(this.books);

      this.dataSource.filterPredicate = (data: BookDto, filter: string) => {
        const filterObj = JSON.parse(filter);
        const searchText = (filterObj.searchText ?? '').toLowerCase();

        const matchesText =
          (data.name ?? '').toLowerCase().includes(searchText) ||
          (data.author ?? '').toLowerCase().includes(searchText) ||
          (data.language ?? '').toLowerCase().includes(searchText) ||
          (data.isbn ?? '').toLowerCase().includes(searchText);

        const matchesStatus =
          filterObj.selectedStatus === '' || data.bookStatus === filterObj.selectedStatus;

        return matchesText && matchesStatus;
      };

      this.dataSource.paginator = this.paginator;
      this.applyCombinedFilter();
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

  onEdit(bookDto: any): void {
    const dialogRef = this.dialog.open(ViewBookDetail, {
      maxWidth: '90vw',
      minWidth: '300px',
      width: 'auto',
      height: 'auto',
      data: { book: bookDto },
      autoFocus: false
    });
  }

  onDelete(element: any): void {
    console.log(element);
    const dialogRef = this.dialog.open(DeleteBook, {
      width: '350px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteBook(element);
      }
    });
  }

  deleteBook(bookDto: BookDto): void {

    const request: BookRequest = {
      userId: this.userId,
      bookId: bookDto.bookId,
      bookDetail: bookDto
    };

    this.bookService.deleteBook(request, this.token).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.snackBar.open('Book delete successfully', 'Close', { duration: 3000, panelClass: ['snack-info'], horizontalPosition: 'center', verticalPosition: 'top' });
          this.loadBookTableData();
        } else {
          this.snackBar.open('Book delete Error ' + response.responseMessage, 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
        }
      },
      error: (err) => {
        this.snackBar.open('Failed to delete book', 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
        console.error('Save error:', err);
      }
    });
  }
}
