import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { AccountAddressService } from '../../services/account-address.service';
import { AccountInfoService } from '../../services/account-info.service';

@Component({
  selector: 'app-account-address-popup',
  templateUrl: './account-address-popup.component.html',
  styleUrl: './account-address-popup.component.css'
})
export class AccountAddressPopupComponent implements OnInit {


  addressForm!: FormGroup;

  addresses: any[] = [];
  errMessage: any;
  provinces: any;
  districts: any;
  wards: any;
  userID: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccountAddressPopupComponent>,
    private _authService: AuthService,
    private addressService: AccountAddressService,
    private accountInfoService: AccountInfoService,) { }

  ngOnInit(): void {

    this.accountInfoService.userId$.subscribe(userId => {
      this.userID = userId;
      console.log('Address component: User ID:', this.userID);
    });

    this.initForm();
    this.apiProvince()
  }
  initForm() {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      specific_address: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      isDefault: [false]
    });
  }

  selectChangeP(event: any) {
    const selectedValue = event.target.value;
    console.log(selectedValue, 'district')
    this.apiDistrict(selectedValue)
    console.log(selectedValue, 'district')

  }
  selectChangeD(event: any) {
    const selectedValue = event.target.value;
    this.apiWard(selectedValue)
  }
  apiProvince() {
    console.log('1235')
    this._authService.getProvince().subscribe({
      next: (data: any) => {
        this.provinces = data;
        console.log(this.provinces, '123')
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }
  apiDistrict(id: any) {
    console.log('1235')
    this._authService.getDistrict(id).subscribe({
      next: (data: any) => {
        this.districts = data;
        console.log(this.districts)
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }
  apiWard(id: any) {
    console.log('ward')
    this._authService.getWard(id).subscribe({
      next: (data: any) => {
        this.wards = data;
        console.log(this.wards)
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }



  addAddress() {
    // Mark all form controls as touched to trigger error messages
    this.addressForm.markAllAsTouched();
    if (this.addressForm.valid) {
      const newAddress = this.addressForm.value;
      console.log('Form Data:', newAddress);

      // Call the service to send data to the server
      this.addressService.addAddress(newAddress, this.userID).subscribe(
        (response) => {
          console.log('Address added successfully:', response);
          // Optionally, you can handle the response or close the dialog.
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error adding address:', error);
          // Optionally, you can display an error message or handle the error.
        }
      );
    } else {
      console.log('Form is not valid. Please check the fields.');
    }
  }

  closePopup() {
    this.dialogRef.close()
  }


}
