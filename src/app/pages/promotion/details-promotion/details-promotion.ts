import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BookDto} from '../../../services/dto/BookDto';
import {PromotionDto} from '../../../services/dto/PromotionDto';
import {MatCard} from '@angular/material/card';
import {MatToolbar} from '@angular/material/toolbar';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {DatePipe, DecimalPipe} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-details-promotion',
  standalone: true,
  imports: [
    MatCard,
    MatToolbar,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatCellDef,
    DecimalPipe,
    DatePipe,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './details-promotion.html',
  styleUrls: ['./details-promotion.scss']
})
export class DetailsPromotion implements OnInit {
  promotion!: PromotionDto;
  displayedColumns: string[] = ['name', 'price', 'quantity', 'discountPrice'];
  dataSource!: MatTableDataSource<BookDto>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { promotion: PromotionDto },
    private dialogRef: MatDialogRef<DetailsPromotion>
  ) {}

  ngOnInit(): void {
    this.promotion = this.data.promotion;
    this.dataSource = new MatTableDataSource<BookDto>(
      this.promotion.bookDetailsDtoList || []
    );
  }

  getDiscountPrice(bookPrice: number): number {
    if (!this.promotion) return bookPrice;

    const promoPrice = this.promotion.promotionPrice || 0;

    if (this.promotion.promotionType === 'FLAT') {
      return Math.max(bookPrice - promoPrice, 0);
    } else if (this.promotion.promotionType === 'PERCENTAGE') {
      return bookPrice * (1 - promoPrice / 100);
    }

    return bookPrice;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
