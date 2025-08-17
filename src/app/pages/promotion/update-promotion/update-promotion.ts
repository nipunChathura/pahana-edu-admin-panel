import { Component } from '@angular/core';
import {AsyncPipe, NgForOf} from '@angular/common';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {MatToolbar} from '@angular/material/toolbar';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatSelect} from '@angular/material/select';
import {BookDto} from '../../../services/dto/BookDto';
import {map, Observable, of, startWith} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {BookService} from '../../../services/book';
import {PromotionService} from '../../../services/promotion.service';
import {Auth} from '../../../services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PromotionRequest} from '../../../services/request/PromotionRequest';
import {PromotionDto} from '../../../services/dto/PromotionDto';
import {AwardDto} from '../../../services/dto/AwardDto';
import {CategoryDto} from '../../../services/dto/CategoryDto';

@Component({
  selector: 'app-update-promotion',
  standalone: true,
  imports: [
    AsyncPipe,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatChipGrid,
    MatChipInput,
    MatChipRemove,
    MatChipRow,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
    MatToolbar,
    NgForOf,
    ReactiveFormsModule,
    MatIconButton
  ],
  templateUrl: './update-promotion.html',
  styleUrl: './update-promotion.scss'
})
export class UpdatePromotion {
  promotionForm!: FormGroup;
  promotionSearchControl = new FormControl();

  promotionList: PromotionDto[] = [];
  filteredPromotions$!: Observable<PromotionDto[]>;
  promotionSelected = false;

  selectedPromotion!: PromotionDto | null;

  userId ;
  token = '';

  minStartDate: Date = new Date();
  minEndDate: Date = new Date();

  availableBooks: BookDto[] = [];
  selectedBooks: BookDto[] = [];
  bookCtrl = new FormControl('');
  filteredBooks: Observable<BookDto[]> = of([]);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  searchText: string = '';

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private promotionService: PromotionService,
    private auth: Auth,
    private snackBar: MatSnackBar
  ) {
    this.token = this.auth.getToken() ?? '';
    this.userId = Number(localStorage.getItem('userId') ?? '');
  }

  ngOnInit(): void {
    this.promotionForm = this.fb.group({
      promotionName: ['', Validators.required],
      priority: [1, Validators.required],
      promotionStartDate: [this.minStartDate, Validators.required],
      promotionStartTime: [this.minStartDate, Validators.required],
      promotionEndDate: [this.minEndDate, Validators.required],
      promotionEndTime: [this.minEndDate, Validators.required],
      promotionType: [{ value: 'FLAT', disabled: true }, Validators.required], // read-only
      promotionStatus: ['ACTIVE', Validators.required],
      promotionPrice: [{ value: '', disabled: true }, Validators.required],   // read-only
      bookIds: [[]]
    });
    this.promotionForm.disable({ onlySelf: false, emitEvent: false });
    this.loadAllPromotion();
    this.loadBooks();
  }

  clearSearch() {
    this.searchText = '';
    this.onCancel();
  }

  displayPromotionTitle(promo?: PromotionDto): string {
    return promo ? promo.promotionName ?? '' : '';
  }

  onPromotionSelected(promotionDto: PromotionDto) {
    if (!promotionDto) return;

    this.selectedPromotion = promotionDto;
    this.promotionSelected = true;

    const start = new Date(promotionDto.promotionStartDate as string);
    const end = new Date(promotionDto.promotionEndDate as string);

    this.selectedBooks = promotionDto.bookDetailsDtoList ?? [];

    // Enable only editable controls
    this.promotionForm.enable();
    this.promotionForm.get('promotionType')?.disable();
    this.promotionForm.get('promotionPrice')?.disable();

    this.promotionForm.patchValue({
      promotionName: promotionDto.promotionName,
      priority: promotionDto.priority,
      promotionStartDate: start,
      promotionStartTime: start,
      promotionEndDate: end,
      promotionEndTime: end,
      promotionType: promotionDto.promotionType,
      promotionStatus: promotionDto.promotionStatus ?? 'ACTIVE',
      promotionPrice: promotionDto.promotionPrice,
      bookIds: this.selectedBooks.map(b => b.bookId)
    });

    this.filteredBooks = of(
      this.availableBooks.filter(b => !this.selectedBooks.some(sb => sb.bookId === b.bookId))
    );
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

  loadAllPromotion(): void {
    this.promotionService.getPromotions(this.userId, true, this.token).subscribe(data => {
      this.promotionList = data?.promotionDtoList ?? [];
      this.setupPromotionFilter();
    });
  }

  private setupPromotionFilter(): void {
    this.filteredPromotions$ = this.promotionSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.promotionName || ''),
      map(name => this._filterPromotions(name))
    );
  }

  private _filterPromotions(value: string): PromotionDto[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.promotionList.filter(promotion =>
      (promotion.promotionName ?? '').toLowerCase().includes(filterValue)
    );
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
    const offset = 5.5 * 60; // Sri Lanka UTC+5:30
    const utc = combined.getTime() - combined.getTimezoneOffset() * 60000;
    return new Date(utc + offset * 60000);
  }

  formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  onSave(): void {
    const formValue = this.promotionForm.getRawValue(); // include disabled fields

    const startDateTime = this.combineDateAndTime(formValue.promotionStartDate, formValue.promotionStartTime);
    const endDateTime = this.combineDateAndTime(formValue.promotionEndDate, formValue.promotionEndTime);

    const request: PromotionRequest = {
      promotionId: this.selectedPromotion?.promotionId ?? null,
      bookId: null,
      requestBookDetails: false,
      promotionDto: {
        promotionId: this.selectedPromotion?.promotionId ?? null,
        promotionName: formValue.promotionName,
        promotionStartDate: this.formatDateToISO(startDateTime),
        promotionEndDate: this.formatDateToISO(endDateTime),
        promotionType: formValue.promotionType,
        promotionStatus: formValue.promotionStatus,
        promotionPrice: formValue.promotionPrice,
        priority: formValue.priority,
        bookIds: formValue.bookIds,
        bookDetailsDtoList: this.selectedBooks.length ? this.selectedBooks : []
      }
    };

    this.promotionService.updatePromotion(request, this.token).subscribe({
      next: response => {
        if (response.status === 'success') {
          this.snackBar.open('Promotion saved successfully', 'Close', {
            duration: 3000,
            panelClass: ['snack-info'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.onCancel();
          this.promotionSearchControl.reset();
          this.loadAllPromotion();
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

  onCancel(): void {
    this.promotionForm.reset({
      promotionStartDate: new Date(),
      promotionStartTime: new Date(),
      promotionEndDate: new Date(),
      promotionEndTime: new Date(),
      priority: 1,
      promotionType: 'FLAT',
      promotionStatus: 'ACTIVE',
      promotionPrice: ''
    });
    this.selectedBooks = [];
    this.promotionForm.disable();
  }
}
