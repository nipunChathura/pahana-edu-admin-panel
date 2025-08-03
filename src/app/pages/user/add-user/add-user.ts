import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../../services/user';
import {Auth} from '../../../services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserDto} from '../../../services/dto/UserDto';
import {UserRequest} from '../../../services/request/UserRequest';
import {MatToolbar} from '@angular/material/toolbar';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    MatToolbar,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
    MatButton,
    MatDialogActions,
    ReactiveFormsModule,
    NgIf,
    MatError
  ],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss'
})

export class AddUser {
  userForm: FormGroup;
  private token;
  private userId = 1;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUser>,
    private userService: UserService,
    private auth: Auth,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])[A-Za-z\d]{4,10}$/)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/)
        ]
      ]
    });

    this.token = this.auth.getToken() ?? '';
  }

  // ngOnInit removed unless necessary

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      const formValues = this.userForm.value;

      const userDto: UserDto = {
        userId: null,
        username: formValues.username,
        password: formValues.password,
        role: null,
        status: null,
        isSystemUser: false
      };

      const request: UserRequest = {
        userId: this.userId,
        userStatus: null,
        searchValue: null,
        userDto: userDto
      };

      this.userService.saveUser(request, this.token).subscribe({
        next: () => {
          this.snackBar.open('User saved successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open('Failed to save user', 'Close', { duration: 3000 });
          console.error('Save error:', err);
        }
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
