import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading = true;
  editUser = false;
  editAddress = false;

  user: any;
  address: any;
  addressId = '';

  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required]
  });

  addressForm = this.fb.group({
    city: ['', Validators.required],
    locality: ['', Validators.required],
    pincode: ['', Validators.required],
    stateName: ['', Validators.required],
    country: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res: any) => {
        console.log('PROFILE RESPONSE', res);
        this.user = {
          firstName: res.first_name,
          lastName: res.last_name,
          username: res.username,
          email: res.email,
          phoneNumber: res.phone_number
        };

        if (res.addresses?.length) {
          const a = res.addresses[0];
          this.addressId = a.addressId || '';
          this.address = {
            city: a.city,
            locality: a.locality,
            pincode: a.pincode,
            stateName: a.State,
            country: a.Country
          };
        }

        this.userForm.patchValue(this.user);
        this.addressForm.patchValue(this.address);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) return;

    this.profileService
      .updatePersonalInfo(this.userForm.value)
      .subscribe({
        next: (updated: any) => {
          this.user = {
            ...this.user,
            firstName: updated.first_name,
            lastName: updated.last_name,
            phoneNumber: updated.phone_number
          };
          this.editUser = false;
        }
      });
  }

  saveAddress(): void {
    if (this.addressForm.invalid || !this.addressId) return;

    this.profileService
      .updateAddress(this.addressId, this.addressForm.value)
      .subscribe({
        next: (updated: any) => {
          this.address = {
            city: updated.city,
            locality: updated.locality,
            pincode: updated.pincode,
            stateName: updated.state_name,
            country: updated.country
          };
          this.editAddress = false;
        }
      });
  }
}
