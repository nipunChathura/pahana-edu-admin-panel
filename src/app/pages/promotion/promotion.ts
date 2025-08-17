import {Component, OnInit, ViewChild} from '@angular/core';
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
import {MatPaginator} from '@angular/material/paginator';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatSelect} from '@angular/material/select';
import {AddPromotion} from './add-promotion/add-promotion';
import {PromotionService} from '../../services/promotion.service';
import {PromotionDto} from '../../services/dto/PromotionDto';
import {HighlightPipe} from '../../services/highlight-pipe';
import {DeleteBook} from '../book/delete-book/delete-book';
import {DeletePromotion} from './delete-promotion/delete-promotion';
import {BookRequest} from '../../services/request/BookRequest';
import {PromotionRequest} from '../../services/request/PromotionRequest';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ViewBookDetail} from '../book/view-book-detail/view-book-detail';
import {DetailsPromotion} from './details-promotion/details-promotion';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [CommonModule, HighlightPipe, MatCell, MatCellDef, MatColumnDef, MatFormField, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatIcon, MatIconButton, MatInput, MatLabel, MatOption, MatPaginator, MatRow, MatRowDef, MatSelect, MatSuffix, MatTable, MatToolbar, ReactiveFormsModule, RouterOutlet, MatHeaderCellDef, FormsModule],
  templateUrl: './promotion.html',
  styleUrl: './promotion.scss'
})
export class Promotion implements OnInit {
  allColumns: string[] = ['action', 'id', 'name', 'startDate', 'endDate', 'type', 'price', 'priority', 'status'];
  dataSource: MatTableDataSource<PromotionDto> = new MatTableDataSource();
  searchText: string = '';
  selectedStatus: string = '';

  private token: string;
  private userId: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private promotionService: PromotionService,
    private dialog: MatDialog,
    private auth: Auth,
  private snackBar: MatSnackBar,
  ) {
    this.token = this.auth.getToken() ?? '';
    this.userId = Number(localStorage.getItem('userId') ?? '');
  }

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.promotionService.getPromotions(this.userId, true, this.token).subscribe((res: any) => {
      if (res.status === 'success') {
        this.dataSource = new MatTableDataSource(res.promotionDtoList);
        this.dataSource.paginator = this.paginator;

        // Only filter promotionName
        this.dataSource.filterPredicate = (data: PromotionDto, filter: string) => {
          const searchText = (filter ?? '').trim().toLowerCase();
          const matchesSearch = (data.promotionName ?? '').toLowerCase().includes(searchText);
          const matchesStatus = this.selectedStatus ? data.promotionStatus === this.selectedStatus : true;
          return matchesSearch && matchesStatus;
        };

        this.applyFilterOrStatus();
      }
    });
  }

  applyFilter(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilterOrStatus();
  }

  applyStatusFilter(): void {
    this.applyFilterOrStatus();
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilterOrStatus();
  }

  private applyFilterOrStatus(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource._updateChangeSubscription();
  }

  onAddPromotion(): void {
    this.dialog.open(AddPromotion, { width: '400px' });
  }

  onView(promotion: PromotionDto): void {
    const dialogRef = this.dialog.open(DetailsPromotion, {
      maxWidth: '90vw',
      minWidth: '300px',
      width: 'auto',
      height: 'auto',
      data: { promotion: promotion },
      autoFocus: false
    });
  }

  onDelete(promotion: PromotionDto): void {
    console.log(promotion);
    const dialogRef = this.dialog.open(DeletePromotion, {
      width: '350px',
      data: promotion
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deletePromotion(promotion);
      }
    });
  }

  private deletePromotion(promotion: PromotionDto) {
    const request: PromotionRequest = {
      promotionId: promotion.promotionId,
      bookId: null,
      requestBookDetails:false,
      promotionDto: promotion
    };

    this.promotionService.deletePromotion(request, this.token).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.snackBar.open('Promotion delete successfully', 'Close', { duration: 3000, panelClass: ['snack-info'], horizontalPosition: 'center', verticalPosition: 'top' });
          this.loadPromotions();
        } else {
          this.snackBar.open('Promotion delete Error ' + response.responseMessage, 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
        }
      },
      error: (err) => {
        this.snackBar.open('Failed to delete promotion', 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
        console.error('Save error:', err);
      }
    });
  }
}
