import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  step = 1;
  loading = false;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // STEP 1
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],

      // STEP 2
      city: ['', Validators.required],
      locality: ['', Validators.required],
      pincode: ['', Validators.required],
      stateName: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  nextStep(): void {
    if (this.isStepOneValid()) {
      this.step = 2;
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  back(): void {
    this.step = 1;
  }

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const v = this.registerForm.value;

    const payload = {
      firstName: v.firstName,
      lastName: v.lastName,
      userName: v.userName,
      email: v.email,
      phoneNumber: v.phoneNumber,
      password: v.password,
      address: {
        city: v.city,
        locality: v.locality,
        pincode: v.pincode,
        stateName: v.stateName,
        country: v.country
      }
    };

    this.loading = true;

    this.AuthService.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Registration failed');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private isStepOneValid(): boolean {
    const fields = [
      'userName',
      'firstName',
      'lastName',
      'phoneNumber',
      'email',
      'password',
      'confirmPassword'
    ];

    const validFields = fields.every(
      f => this.registerForm.get(f)?.valid
    );

    return (
      validFields &&
      this.registerForm.value.password ===
      this.registerForm.value.confirmPassword
    );
  }
}
