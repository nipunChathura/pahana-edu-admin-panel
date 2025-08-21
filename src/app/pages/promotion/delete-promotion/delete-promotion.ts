import {Component, Inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatToolbar} from '@angular/material/toolbar';
import {BookDto} from '../../../services/dto/BookDto';
import {PromotionDto} from '../../../services/dto/PromotionDto';

@Component({
  selector: 'app-delete-promotion',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatToolbar
  ],
  templateUrl: './delete-promotion.html',
  styleUrl: './delete-promotion.scss'
})
export class DeletePromotion {
  constructor(
    public dialogRef: MatDialogRef<DeletePromotion>,
    @Inject(MAT_DIALOG_DATA) public data: PromotionDto
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
