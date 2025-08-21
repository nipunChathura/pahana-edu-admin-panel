import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatToolbar} from '@angular/material/toolbar';
import { CategoryService } from '../../../services/category';
import {Auth} from '../../../services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryRequest} from '../../../services/request/CategoryRequest';
import {CategoryDto} from '../../../services/dto/CategoryDto';

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
  private token ;
  private userId;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryAddDialog>,
    private categoryService: CategoryService,
    private auth: Auth,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      categoryStatus: ['ACTIVE', Validators.required],
    });
    this.token = this.auth.getToken() ?? '';
    this.userId = Number(localStorage.getItem('userId') ?? '');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      const formValues = this.categoryForm.value;

      const categoryDto: CategoryDto = {
        categoryId: null,
        categoryName: formValues.categoryName,
        categoryStatus: formValues.categoryStatus
      };

      const request: CategoryRequest = {
        userId: this.userId,
        categoryId: null,
        categoryDetail: categoryDto
      };

      this.categoryService.saveCategory(request, this.token).subscribe({
        next: () => {
          this.snackBar.open('Category saved successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open('Failed to save category', 'Close', { duration: 3000 });
          console.error('Save error:', err);
        }
      });
    }
  }
}
