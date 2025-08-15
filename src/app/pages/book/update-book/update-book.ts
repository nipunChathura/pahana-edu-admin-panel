import {Component, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {MatToolbar} from "@angular/material/toolbar";
import {CategoryDto} from '../../../services/dto/CategoryDto';
import {CategoryApiResponse} from '../../../services/response/CategoryApiResponse';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {MatTableDataSource} from '@angular/material/table';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {debounceTime, distinctUntilChanged, map, Observable, of, startWith} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {BookDto} from '../../../services/dto/BookDto';
import {BookService} from '../../../services/book';
import {Auth} from '../../../services/auth';
import {BookRequest} from '../../../services/request/BookRequest';
import {MatDividerModule} from '@angular/material/divider';
import {AwardDto} from '../../../services/dto/AwardDto';
import {CategoryService} from '../../../services/category';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GcpService} from '../../../services/gcp.service';

@Component({
  selector: 'app-update-book',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatToolbar,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    NgForOf,
    AsyncPipe,
    MatButton,
    MatIcon,
    MatMiniFabButton,
    MatTab,
    MatTabGroup,
    NgIf,
    MatDividerModule
  ],
  templateUrl: './update-book.html',
  styleUrl: './update-book.scss'
})
export class UpdateBook implements OnInit {
  bookDetailsForm!: FormGroup;
  bookSearchControl = new FormControl();
  categoryControl = new FormControl();

  books: BookDto[] = [];
  filteredBooks$!: Observable<BookDto[]>;

  categories: CategoryDto[] = [];
  filteredCategories$!: Observable<CategoryDto[]>;

  imagePreview: string | null = null;
  defaultImage = 'assets/default-book.png';
  selectedImageFile: File | null = null;

  userId: number = 1;
  token!: string;

  bookSelected = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private categoryService: CategoryService,
    private auth: Auth,
    private snackBar: MatSnackBar,
    private gcpService: GcpService
  ) {
    this.token = this.auth.getToken() ?? '';
  }

  ngOnInit(): void {
    this.initForm();
    this.loadAllBooks();
    this.getCategories();
    this.setupBookFilter();
    this.setupCategoryFilter();
  }

  // ---------------- Form ----------------
  private initForm() {
    this.bookDetailsForm = this.fb.group({
      bookId: [{ value: null, disabled: true }],
      name: [{ value: '', disabled: true }],
      categoryId: [{ value: null, disabled: true }],
      category: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      author: [{ value: '', disabled: true }],
      language: [{ value: '', disabled: true }],
      publisher: [{ value: '', disabled: true }],
      publishDate: [{ value: '', disabled: true }],
      isbn: [{ value: '', disabled: true }],
      price: [{ value: null, disabled: true }],
      quantity: [{ value: null, disabled: true }],
      awards: this.fb.array([])
    });

  }

  get awards(): FormArray {
    return this.bookDetailsForm.get('awards') as FormArray;
  }

  addAward() {
    this.awards.push(this.fb.group({
      awardId: [null],
      awardName: [''],
      awardDescription: ['']
    }));
  }

  removeAward(index: number) {
    this.awards.removeAt(index);
  }

  // ---------------- Load books ----------------
  private loadAllBooks() {
    this.bookService.getBooks(this.userId, this.token).subscribe(data => {
      this.books = data?.bookDetailsList ?? [];
      this.filteredBooks$ = of(this.books);
    });
  }

  private setupBookFilter() {
    this.filteredBooks$ = this.bookSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.name || ''),
      map(name => this._filterBooks(name))
    );
  }

  private _filterBooks(name: string): BookDto[] {
    const filterValue = name.toLowerCase();
    return this.books.filter(book =>
      (book.name ?? '').toLowerCase().includes(filterValue) ||
      (book.author ?? '').toLowerCase().includes(filterValue) ||
      (book.language ?? '').toLowerCase().includes(filterValue) ||
      (book.isbn ?? '').toLowerCase().includes(filterValue)
    );
  }

  displayBookTitle(book: BookDto): string {
    return book && book.name ? book.name : '';
  }

  onBookSelected(book: BookDto) {
    if (!book) return;

    this.bookDetailsForm.enable();
    this.bookSelected = true;

    this.bookDetailsForm.patchValue({
      bookId: book.bookId,
      name: book.name,
      description: book.description,
      author: book.author,
      language: book.language,
      publisher: book.publisher,
      publishDate: book.publishDate,
      isbn: book.isbn,
      price: book.price,
      quantity: book.quantity
    });

    const selectedCategory = this.categories.find(c => c.categoryName === book.categoryName);
    this.categoryControl.setValue(selectedCategory || null);

    this.imagePreview = book.imageUrl || null;
    this.selectedImageFile = null; // Reset selected image file

    // Awards
    this.awards.clear();
    if (book.awardList && book.awardList.length > 0) {
      book.awardList.forEach((award: AwardDto) => {
        this.awards.push(this.fb.group({
          awardId: [award.awardId],
          awardName: [award.awardName],
          awardDescription: [award.awardDescription]
        }));
      });
    } else {
      this.addAward();
    }
  }

  // ---------------- Categories ----------------
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

  private setupCategoryFilter() {
    this.filteredCategories$ = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.categoryName || ''),
      map(name => this._filterCategories(name))
    );
  }

  private _filterCategories(name: string): CategoryDto[] {
    const filterValue = name.toLowerCase();
    return this.categories.filter(c => (c.categoryName ?? '').toLowerCase().includes(filterValue));
  }

  displayCategory(category: CategoryDto): string {
    return category && category.categoryName ? category.categoryName : '';
  }

  // ---------------- Image ----------------
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file; // save selected file
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImageFile = null;
    this.imagePreview = null;
  }

  // ---------------- Update ----------------
  onUpdate() {
    if (!this.bookDetailsForm.valid) {
      this.bookDetailsForm.markAllAsTouched();
      return;
    }

    const selectedCategory: CategoryDto | null = this.categoryControl.value;
    const formValue = this.bookDetailsForm.value;

    // Prepare award list
    const awardList: AwardDto[] = (formValue.awards || [])
      .filter((a: any) => a.awardName?.trim() || a.awardDescription?.trim())
      .map((a: any) => ({
        awardId: a.awardId ?? null,
        bookId: formValue.bookId ?? null,
        awardName: a.awardName?.trim() || null,
        awardDescription: a.awardDescription?.trim() || null
      }));

    const bookDetail: BookDto = {
      ...formValue,
      categoryId: selectedCategory?.categoryId ?? null,
      categoryName: selectedCategory?.categoryName ?? '',
      awardList: awardList,
      imageUrl: this.imagePreview // temporary, will be replaced if uploading new image
    };

    // Upload image first if new file selected
    if (this.selectedImageFile) {
      this.gcpService.uploadImage(this.selectedImageFile, this.token).subscribe({
        next: res => {
          if (res.status === 'success') {
            bookDetail.imageUrl = res.imageUrl; // set uploaded URL
            this.sendUpdateRequest(bookDetail);
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
      this.sendUpdateRequest(bookDetail);
    }
  }

  private sendUpdateRequest(bookDetail: BookDto) {
    const request: BookRequest = {
      userId: this.userId,
      bookId: bookDetail.bookId,
      bookDetail: bookDetail
    };

    this.bookService.updateBook(request, this.token).subscribe({
      next: res => {
        if (res.status === 'success') {
          this.snackBar.open('Book updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['snack-info'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.bookDetailsForm.reset();
          this.imagePreview = null;
          this.selectedImageFile = null;
          this.bookSearchControl.reset();

          while (this.awards.length > 0) {
            this.awards.removeAt(0);
          }

          // Reload all books
          this.loadAllBooks();

        } else {
          this.snackBar.open(`Book update error: ${res.responseMessage}`, 'Close', {
            duration: 3000,
            panelClass: ['snack-error'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: err => console.error('Book update failed', err)
    });
  }

  // ---------------- Cancel ----------------
  onCancel() {
    this.bookDetailsForm.reset();
    this.imagePreview = null;
    this.selectedImageFile = null;
    this.bookSearchControl.reset();
  }
}
