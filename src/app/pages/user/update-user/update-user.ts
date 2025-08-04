import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatToolbar} from '@angular/material/toolbar';
import {MatOption, MatSelect} from '@angular/material/select';
import {Auth} from '../../../services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgIf} from '@angular/common';
import {UserService} from '../../../services/user';
import {UserDto} from '../../../services/dto/UserDto';
import {UserRequest} from '../../../services/request/UserRequest';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatToolbar,
    ReactiveFormsModule,
    MatError,
    NgIf
  ],
  templateUrl: './update-user.html',
  styleUrl: './update-user.scss'
})
export class UpdateUser {
  userForm: FormGroup;
  private token;
  private userId = 1;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateUser>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: Auth,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      userId: [{ value: '', disabled: true }],
      username: [
        { value: '', disabled: true }
      ],
      userStatus: ['ACTIVE', Validators.required],
    });

    this.token = this.auth.getToken() ?? '';
  }

  ngOnInit(): void {
    console.log(this.data)
    if (this.data) {
      this.userForm.patchValue({
        userId: this.data.userId,
        username: this.data.username,
        userStatus: this.data.status,
      });
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      const formValues = this.userForm.value;

      const userDto: UserDto = {
        userId: this.data.userId,
        username: formValues.username,
        password: formValues.password,
        role: this.data.role,
        status: formValues.userStatus,
        isSystemUser: this.data.isSystemUser
      };

      const request: UserRequest = {
        userId: this.userId,
        userStatus: null,
        searchValue: null,
        userDto: userDto
      };

      this.userService.updateUser(request, this.token).subscribe({
        next: () => {
          this.snackBar.open('User update successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open('Failed to update user', 'Close', { duration: 3000 });
          console.error('Save error:', err);
        }
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
