import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-category-add-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatFormField,
    MatSelect,
    MatDialogActions,
    MatOption,
    MatLabel,
    MatToolbar
  ],
  templateUrl: './category-add-dialog.html',
  styleUrl: './category-add-dialog.scss'
})
export class CategoryAddDialog {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryAddDialog>
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      categoryStatus: ['ACTIVE', Validators.required],
    });
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
