import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [
    MatCard,
    MatTabGroup,
    MatTab,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './login-signup.html',
  styleUrl: './login-signup.scss'
})
export class LoginSignup {
  selectedTabIndex = 0;
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private auth: Auth) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.auth.login(username, password).subscribe({
        next: (response) => {
          console.log('Token:', response.token);
          localStorage.setItem('authToken', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Login failed. Please check your credentials.');
        }
      });
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;

      this.auth.register(signupData).subscribe({
        next: (response) => {
          console.log('Signup successful:', response);
          alert('Registration successful. You can now log in.');
          this.selectedTabIndex = 0;
          this.signupForm.reset();
        },
        error: (error) => {
          console.error('Signup failed:', error);
          alert('Signup failed. Please try again.');
        },
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
