import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {CommonModule, NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {BookDto} from '../../../services/dto/BookDto';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-view-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    NgIf,
    MatIconButton
  ],
  templateUrl: './view-book-detail.html',
  styleUrl: './view-book-detail.scss'
})
export class ViewBookDetail {
  book: BookDto;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { book: BookDto },
              private dialogRef: MatDialogRef<ViewBookDetail>) {
    this.book = data.book;
  }

  get imageUrl(): string {
    return this.book?.imageUrl || 'assets/default-image-icon.png';
  }

  get formattedPublishDate(): string {
    return this.book?.publishDate || 'N/A';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
