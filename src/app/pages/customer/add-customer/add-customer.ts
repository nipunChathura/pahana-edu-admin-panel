import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {Auth} from '../../../services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomerService} from '../../../services/customer';
import {CustomerDto} from '../../../services/dto/CustomerDto';
import {CustomerRequest} from '../../../services/request/CustomerRequest';
import {MatToolbar} from '@angular/material/toolbar';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
    MatToolbar,
    MatDialogContent,
    MatFormField,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
    MatButton,
    MatDialogActions,
    MatError,
    NgIf,
  ],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.scss'
})
export class AddCustomer {
  customerForm: FormGroup;
  private token ;
  private userId = 1;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCustomer>,
    private customerService: CustomerService,
    private auth: Auth,
    private snackBar: MatSnackBar
  ) {
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(?:\+94|0)?7\d{8}$/)]],
    });
    this.token = this.auth.getToken() ?? '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.customerForm.valid) {
      const formValues = this.customerForm.value;

      const customerDto: CustomerDto = {
        customerId: null,
        customerRegNo: null,
        customerName: formValues.customerName,
        email: formValues.customerEmail,
        phoneNumber: formValues.phoneNumber,
        membershipType: null,
        status:null
      };

      const request: CustomerRequest = {
        userId: this.userId,
        customerId: null,
        customerDto: customerDto
      };

      this.customerService.saveCustomer(request, this.token).subscribe({
        next: () => {
          this.snackBar.open('Customer saved successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open('Failed to save customer', 'Close', { duration: 3000 });
          console.error('Save error:', err);
        }
      });
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
