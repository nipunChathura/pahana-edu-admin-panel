import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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

@Component({
  selector: 'app-update-book',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
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
    NgIf
  ],
  templateUrl: './update-book.html',
  styleUrl: './update-book.scss'
})
export class UpdateBook {
  bookDetailsForm: FormGroup;

  categories: CategoryDto[] = [];
  filteredCategories$: Observable<CategoryDto[]> = of([]);
  categoryControl: FormControl;
  selectedStatus: string = '';

  selectedImageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  defaultImage = 'assets/default-image-icon.png';

  constructor(private fb: FormBuilder) {
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
      imageUrl: ['', Validators.required],
      awardName: ['', Validators.required],
      awardDescription: ['', Validators.required],
    });

    this.categoryControl = this.bookDetailsForm.get('categoryId') as FormControl;
  }

  ngOnInit() {
    // Sample categories
    this.categories = [
      { categoryId: 1, categoryName: 'Science', categoryStatus: 'ACTIVE' },
      { categoryId: 2, categoryName: 'Math', categoryStatus: 'ACTIVE' },
      { categoryId: 3, categoryName: 'History', categoryStatus: 'INACTIVE' },
      { categoryId: 4, categoryName: 'Novel', categoryStatus: 'ACTIVE' },
      { categoryId: 5, categoryName: 'Technology', categoryStatus: 'ACTIVE' },
      { categoryId: 6, categoryName: 'Art', categoryStatus: 'ACTIVE' },
    ];

    this.filteredCategories$ = this.categoryControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      map(value => this._filterCategories(value))
    );
  }

  private _filterCategories(value: any): CategoryDto[] {
    const filterValue = (typeof value === 'string' ? value : '').toLowerCase();

    return this.categories
      .filter(c =>
        ((c.categoryName ?? '').toLowerCase().includes(filterValue)) &&
        (!this.selectedStatus || c.categoryStatus === this.selectedStatus)
      )
      .slice(0, 5);
  }

  displayCategory(category: CategoryDto): string {
    return category?.categoryName ?? '';
  }

  applyStatusFilter() {
    const searchTerm = this.categoryControl.value ?? '';
    this.filteredCategories$ = of(this._filterCategories(searchTerm));
  }

  onCategorySelected(category: CategoryDto) {
    console.log('Selected category:', category.categoryName);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.selectedImageFile = file;

      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);

      this.bookDetailsForm.patchValue({ imageUrl: file.name });
    }
  }

  removeImage() {
    this.selectedImageFile = null;
    this.imagePreview = null;
    this.bookDetailsForm.patchValue({ imageUrl: '' });
  }

  onSave() {
    if (this.bookDetailsForm.valid) {
      const formValue = this.bookDetailsForm.value;
      const bookDetail = {
        ...formValue,
        categoryId: formValue.categoryId?.categoryId ?? null,
        awardList: [{
          awardName: formValue.awardName,
          awardDescription: formValue.awardDescription
        }]
      };
      console.log('Saved book detail:', bookDetail);
      // TODO: send to backend API
    } else {
      this.bookDetailsForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.bookDetailsForm.reset();
    this.removeImage();
  }
}
