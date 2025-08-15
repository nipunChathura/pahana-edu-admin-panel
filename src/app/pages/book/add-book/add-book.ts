import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {map, Observable, of, startWith} from 'rxjs';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatDivider} from '@angular/material/divider';
import {BookService} from '../../../services/book';
import {CategoryService} from '../../../services/category';
import {BookRequest} from '../../../services/request/BookRequest';
import {BookDto} from '../../../services/dto/BookDto';
import {AwardDto} from '../../../services/dto/AwardDto';
import {GcpService} from '../../../services/gcp.service';
import {Auth} from '../../../services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryDto} from '../../../services/dto/CategoryDto';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule, MatIconModule, MatAutocompleteTrigger, MatAutocomplete, MatDivider],
  templateUrl: './add-book.html',
  styleUrl: './add-book.scss'
})
export class AddBook {

  bookDetailsForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  defaultImage = 'assets/default-image-icon.png';
  selectedImageFile: File | null = null;

  categories: CategoryDto[] = [];
  filteredCategories$: Observable<CategoryDto[]> = of([]);
  private token: string;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private bookService: BookService,
    private gcpService: GcpService,
    private auth: Auth,
    private snackBar: MatSnackBar
  ) {
    this.bookDetailsForm = this.fb.group({});
    this.token = this.auth.getToken() ?? '';
  }

  ngOnInit() {
    this.bookDetailsForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: [null, Validators.required],
      description: ['', Validators.required],
      language: ['', Validators.required],
      author: ['', Validators.required],
      publisher: ['', Validators.required],
      publishDate: ['', Validators.required],
      isbn: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      awards: this.fb.array([]) // optional awards
    });

    // Initialize with one empty award
    this.addAward();

    // Load categories from API
    this.getCategories();

    // Setup autocomplete filter
    this.filteredCategories$ = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCategories(value))
    );
  }

  // Awards FormArray
  get awards(): FormArray {
    return this.bookDetailsForm.get('awards') as FormArray;
  }

  createAward(): FormGroup {
    return this.fb.group({
      awardName: [''],
      awardDescription: ['']
    });
  }

  addAward() {
    const lastAward = this.awards.at(this.awards.length - 1);
    if (!lastAward || lastAward.value.awardName || lastAward.value.awardDescription) {
      this.awards.push(this.createAward());
    }
  }

  removeAward(index: number) {
    this.awards.removeAt(index);
  }

  get categoryControl(): FormControl {
    return this.bookDetailsForm.get('categoryId') as FormControl;
  }

  private _filterCategories(value: any): CategoryDto[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.categories
      .filter(category => category.categoryName?.toLowerCase().includes(filterValue))
      .slice(0, 5);
  }

  displayCategory(category: CategoryDto): string {
    return category?.categoryName || '';
  }

  onSave() {
    if (!this.bookDetailsForm.valid) {
      this.bookDetailsForm.markAllAsTouched();
      return;
    }

    const formValue = this.bookDetailsForm.value;

    const awardList: AwardDto[] = (formValue.awards || [])
      .filter((a: any) => a.awardName?.trim() || a.awardDescription?.trim())
      .map((a: any) => ({
        awardId: null,
        bookId: null,
        awardName: a.awardName?.trim() || null,
        awardDescription: a.awardDescription?.trim() || null
      }));

    if (this.selectedImageFile) {
      this.gcpService.uploadImage(this.selectedImageFile, this.token).subscribe({
        next: res => {
          if (res.status === 'success') {
            this.saveBook(res.imageUrl, formValue, awardList, this.token);
          } else {
            this.snackBar.open(`Image upload error: ${res.responseMessage}`, 'Close', {
              duration: 3000,
              panelClass: ['snack-error'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        },
        error: err => console.error('Image upload failed', err)
      });
    } else {
      this.saveBook(null, formValue, awardList, this.token);
    }
  }

  private saveBook(imageUrl: string | null, formValue: any, awardList: AwardDto[], token: string) {
    const bookDto: BookDto = {
      bookId: null,
      name: formValue.name || null,
      categoryId: formValue.categoryId?.categoryId ?? null,
      categoryName: null,
      description: formValue.description || null,
      language: formValue.language || null,
      author: formValue.author || null,
      publisher: formValue.publisher || null,
      publishDate: formValue.publishDate || null,
      isbn: formValue.isbn || null,
      price: formValue.price ?? null,
      isPromotionEnable: false,
      promotionId: null,
      promotionType: null,
      promotionPrice: null,
      promotionBookPrice: null,
      quantity: formValue.quantity ?? null,
      imageUrl: imageUrl || null,
      bookStatus: null,
      awardList
    };

    const bookRequest: BookRequest = {
      userId: 1,
      bookId: null,
      bookDetail: bookDto
    };

    this.bookService.saveBook(bookRequest, token).subscribe({
      next: response => {
        if (response.status === 'success') {
          this.snackBar.open('Book saved successfully', 'Close', {
            duration: 3000,
            panelClass: ['snack-info'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.onCancel();
        } else {
          this.snackBar.open(`Book save error: ${response.responseMessage}`, 'Close', {
            duration: 3000,
            panelClass: ['snack-error'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: err => console.error('Error saving book', err)
    });
  }

  onCancel() {
    this.bookDetailsForm.reset();
    this.awards.clear();
    this.addAward();
    this.imagePreview = null;
    this.selectedImageFile = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedImageFile);
      this.bookDetailsForm.patchValue({ imageUrl: this.selectedImageFile.name });
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.selectedImageFile = null;
    this.bookDetailsForm.patchValue({ imageUrl: '' });
  }

  getCategories(): void {
    this.categoryService.getCategoriesByStatus(1, 'ACTIVE', this.token).subscribe({
      next: response => {
        if (response.status === 'success') {
          this.categories = response.categoryDetailsList;
        } else {
          console.error('Error loading categories', response.responseMessage);
        }
      },
      error: err => console.error('Error loading categories', err)
    });
  }

}
