import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) { // ✅ inject Router
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
      console.log('Login Data:', this.loginForm.value);
      this.router.navigate(['/dashboard']);
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      console.log('Signup Data:', this.signupForm.value);
      alert('You are logged in now');
      this.selectedTabIndex = 0;
      this.loginForm.reset();
    }
  }
}
