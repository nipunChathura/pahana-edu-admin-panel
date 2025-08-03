import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatToolbar} from "@angular/material/toolbar";

@Component({
  selector: 'app-delete-user',
  standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatToolbar
    ],
  templateUrl: './delete-user.html',
  styleUrl: './delete-user.scss'
})
export class DeleteUser {
  constructor(
    public dialogRef: MatDialogRef<DeleteUser>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
