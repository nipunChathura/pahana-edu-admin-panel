import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-category-update-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatToolbar
  ],
  templateUrl: './category-update-dialog.html',
  styleUrl: './category-update-dialog.scss'
})
export class CategoryUpdateDialog {

  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.categoryForm = this.fb.group({
        categoryId: [{ value: '', disabled: true }],
        categoryName: ['', Validators.required],
        categoryStatus: ['ACTIVE', Validators.required],
      });
  }

  ngOnInit(): void {
    if (this.data) {
      // Patch values but keep categoryId disabled
      this.categoryForm.patchValue({
        categoryId: this.data.categoryId,
        categoryName: this.data.categoryName,
        categoryStatus: this.data.categoryStatus,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value);
    }
  }

}
