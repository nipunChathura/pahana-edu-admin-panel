import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgForOf} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatChip, MatChipInput, MatChipInputEvent} from '@angular/material/chips';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {MatToolbar} from '@angular/material/toolbar';
import {BookDto} from '../../../services/dto/BookDto';
import {map, Observable, of, startWith} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {BookService} from '../../../services/book';
import {PromotionService} from '../../../services/promotion.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import {Auth} from '../../../services/auth';
import {MatButton} from '@angular/material/button';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerModule,
  MatTimepickerToggle
} from '@angular/material/timepicker';
import {PromotionRequest} from '../../../services/request/PromotionRequest';


@Component({
  selector: 'app-add-promotion',
  standalone: true,
  providers: [],
  imports: [
    AsyncPipe,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    NgForOf,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatLabel,
    MatDatepickerToggle,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatSelectModule,
    NgForOf,
    MatToolbar,
    MatAutocomplete,
    MatChipInput,
    MatAutocompleteTrigger,
    MatIcon,
    CommonModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatTimepickerInput,
    MatTimepicker,
    MatTimepickerToggle,
    MatTimepickerModule,
    MatDatepickerModule,
    MatChipsModule,
  ],
  templateUrl: './add-promotion.html',
  styleUrl: './add-promotion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPromotion implements OnInit {
  promotionForm!: FormGroup;

  userId = 1;
  token = '';

  minStartDate: Date = new Date();
  minEndDate: Date = new Date();

  availableBooks: BookDto[] = [];
  selectedBooks: BookDto[] = [];
  bookCtrl = new FormControl('');
  filteredBooks: Observable<BookDto[]> = of([]);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(private fb: FormBuilder,
              private bookService: BookService,
              private promotionService: PromotionService,
              private auth: Auth,
              private snackBar: MatSnackBar) {
    this.token = this.auth.getToken() ?? '';
  }

  ngOnInit(): void {
    this.promotionForm = this.fb.group({
      promotionName: ['', Validators.required],
      priority: [1, Validators.required],
      promotionStartDate: [this.minStartDate, Validators.required],
      promotionStartTime: [this.minStartDate, Validators.required],
      promotionEndDate: [this.minEndDate, Validators.required],
      promotionEndTime: [this.minEndDate, Validators.required],
      promotionType: ['FLAT', Validators.required],
      promotionPrice: ['', Validators.required],
      bookIds: [[]]
    });

    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks(this.userId, this.token).subscribe(data => {
      this.availableBooks = data.bookDetailsList || [];
      this.filteredBooks = this.bookCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterBooks(value))
      );
    });
  }

  private _filterBooks(value: string | null): BookDto[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.availableBooks.filter(
      book => (book.name ?? '').toLowerCase().includes(filterValue) &&
        !this.selectedBooks.some(sb => sb.bookId === book.bookId)
    );
  }

  addBook(event: MatChipInputEvent): void {
    const value = (event.value ?? '').trim();
    if (!value) return;

    const found = this.availableBooks.find(b => (b.name ?? '').trim().toLowerCase() === value.toLowerCase());
    if (found && !this.selectedBooks.some(sb => sb.bookId === found.bookId)) {
      this.selectedBooks.push(found);
      this.updateBookIds();
    }

    event.chipInput?.clear();
    this.bookCtrl.setValue('');
  }

  selectedBook(event: MatAutocompleteSelectedEvent): void {
    const value = (event.option.value ?? '').trim();
    const found = this.availableBooks.find(b => (b.name ?? '').trim().toLowerCase() === value.toLowerCase());
    if (found && !this.selectedBooks.some(sb => sb.bookId === found.bookId)) {
      this.selectedBooks.push(found);
      this.updateBookIds();
    }
    this.bookCtrl.setValue('');
  }

  removeBook(book: BookDto): void {
    this.selectedBooks = this.selectedBooks.filter(b => b.bookId !== book.bookId);
    this.updateBookIds();
  }

  private updateBookIds(): void {
    this.promotionForm.patchValue({
      bookIds: this.selectedBooks.map(b => b.bookId)
    });
  }

  private combineDateAndTime(date: Date, time: Date): Date {
    const combined = new Date(date);
    combined.setHours(time.getHours(), time.getMinutes(), 0, 0);

    // Convert to Sri Lanka time (UTC+5:30)
    const offset = 5.5 * 60; // minutes
    const utc = combined.getTime() - combined.getTimezoneOffset() * 60000;
    return new Date(utc + offset * 60000);
  }

  onSave(): void {
    const formValue = this.promotionForm.value;

    const startDateTime = this.combineDateAndTime(formValue.promotionStartDate, formValue.promotionStartTime);
    console.log(startDateTime)
    const endDateTime = this.combineDateAndTime(formValue.promotionEndDate, formValue.promotionEndTime);
    console.log(endDateTime)

    const request: PromotionRequest = {
      promotionId: null,
      bookId: null,
      requestBookDetails: false,
      promotionDto: {
        promotionId: null,
        promotionName: formValue.promotionName,
        promotionStartDate: this.formatDateTime(startDateTime),
        promotionEndDate: this.formatDateTime(endDateTime),
        promotionType: formValue.promotionType,
        promotionPrice: formValue.promotionPrice,
        priority: formValue.priority,
        promotionStatus: null,
        bookIds: formValue.bookIds,
        bookDetailsDtoList: null
      }
    };

    this.promotionService.savePromotion(request, this.token).subscribe({
      next: response => {
        if (response.status === 'success') {
          this.snackBar.open('Promotion saved successfully', 'Close', {
            duration: 3000,
            panelClass: ['snack-info'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.onCancel();
        } else {
          this.snackBar.open(`Promotion save error: ${response.responseMessage}`, 'Close', {
            duration: 3000,
            panelClass: ['snack-error'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: err => console.error('Error saving promotion', err)
    });
  }

  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  onCancel(): void {
    this.promotionForm.reset({
      promotionStartDate: new Date(),
      promotionStartTime: new Date(),
      promotionEndDate: new Date(),
      promotionEndTime: new Date(),
      priority: 1,
      promotionType: 'FLAT',
      bookIds: []
    });
    this.selectedBooks = [];
  }
}
