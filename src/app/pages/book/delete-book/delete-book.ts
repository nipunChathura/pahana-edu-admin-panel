import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {BookDto} from '../../../services/dto/BookDto';

@Component({
  selector: 'app-delete-book',
  standalone: true,
  imports: [
    MatToolbar,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './delete-book.html',
  styleUrls: ['./delete-book.scss']
})
export class DeleteBook {
  constructor(
    public dialogRef: MatDialogRef<DeleteBook>,
    @Inject(MAT_DIALOG_DATA) public data: BookDto
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
