import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatToolbar} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomerService} from '../../../services/customer';
import {Auth} from '../../../services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomerDto} from '../../../services/dto/CustomerDto';
import {CustomerRequest} from '../../../services/request/CustomerRequest';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-update-customer',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatToolbar,
    NgIf,
    ReactiveFormsModule,
    MatOption,
    MatSelect
  ],
  templateUrl: './update-customer.html',
  styleUrl: './update-customer.scss'
})
export class UpdateCustomer {
  customerForm: FormGroup;
  private token ;
  private userId ;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateCustomer>,
    private customerService: CustomerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: Auth,
    private snackBar: MatSnackBar
  ) {
    this.customerForm = this.fb.group({
      customerRegNo: [{ value: '', disabled: true }],
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      phoneNumber: [{ value: '', disabled: true }],
      membership: ['ACTIVE', Validators.required],
      customerStatus: ['SILVER', Validators.required]
    });
    this.token = this.auth.getToken() ?? '';
    this.userId = Number(localStorage.getItem('userId') ?? '');
  }

  ngOnInit(): void {
    console.log(this.data)
    if (this.data) {
      // Patch values but keep categoryId disabled
      this.customerForm.patchValue({
        customerRegNo: this.data.customerRegNo,
        customerName: this.data.customerName,
        customerEmail: this.data.email,
        phoneNumber: this.data.phoneNumber,
        membership: this.data.membershipType,
        customerStatus: this.data.status
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.customerForm.valid) {
      const formValues = this.customerForm.value;

      const customerDto: CustomerDto = {
        customerId: this.data.customerId,
        customerRegNo: this.data.customerRegNo,
        customerName: formValues.customerName,
        email: formValues.customerEmail,
        phoneNumber: this.data.phoneNumber,
        membershipType: formValues.membership,
        status: formValues.customerStatus
      };

      console.log(customerDto)

      const request: CustomerRequest = {
        userId: this.userId,
        customerId: this.data.customerId,
        customerDto: customerDto
      };

      console.log(request)

      this.customerService.updateCustomer(request, this.token).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.snackBar.open('Customer update successfully', 'Close', { duration: 3000, panelClass: ['snack-info'], horizontalPosition: 'center', verticalPosition: 'top' });
            this.dialogRef.close(true);
          } else {
            this.snackBar.open('Customer update Error ' + response.responseMessage, 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          this.snackBar.open('Failed to update customer', 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
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
