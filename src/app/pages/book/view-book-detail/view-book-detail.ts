import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {CategoryService} from '../../../services/category';
import {Auth} from '../../../services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryDto} from '../../../services/dto/CategoryDto';
import {CategoryRequest} from '../../../services/request/CategoryRequest';
import {MatToolbar} from '@angular/material/toolbar';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-view-book-detail',
  standalone: true,
  imports: [
    MatToolbar,
    MatDialogContent,
    ReactiveFormsModule,
    MatLabel,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatInput,
    MatFormField,
    MatButton
  ],
  templateUrl: './view-book-detail.html',
  styleUrl: './view-book-detail.scss'
})
export class ViewBookDetail {
  categoryForm: FormGroup;
  private token ;
  private userId = 1;

  bookName : string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ViewBookDetail>,
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
    this.bookName = this.data.categoryName
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
