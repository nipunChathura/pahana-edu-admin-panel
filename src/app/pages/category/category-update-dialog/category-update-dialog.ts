import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {CategoryDto} from '../../../services/dto/CategoryDto';
import {CategoryRequest} from '../../../services/request/CategoryRequest';
import {CategoryService} from '../../../services/category';
import {Auth} from '../../../services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  private token ;
  private userId = 1;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private auth: Auth,
    private snackBar: MatSnackBar,
    ) {
      this.categoryForm = this.fb.group({
        categoryId: [{ value: '', disabled: true }],
        categoryName: ['', Validators.required],
        categoryStatus: ['ACTIVE', Validators.required],
      });
    this.token = this.auth.getToken() ?? '';
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
      const formValues = this.categoryForm.value;

      const categoryDto: CategoryDto = {
        categoryId: this.data.categoryId,
        categoryName: formValues.categoryName,
        categoryStatus: formValues.categoryStatus
      };

      const request: CategoryRequest = {
        userId: this.userId,
        categoryId: this.data.categoryId,
        categoryDetail: categoryDto
      };

      this.categoryService.updateCategory(request, this.token).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.snackBar.open('Category update successfully', 'Close', { duration: 3000, panelClass: ['snack-info'], horizontalPosition: 'center', verticalPosition: 'top' });
            this.dialogRef.close(true);
          } else {
            this.snackBar.open('Category update Error ' + response.responseMessage, 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          this.snackBar.open('Failed to update category', 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
          console.error('Save error:', err);
        }
      });
    }
  }

}
