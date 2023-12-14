import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-address-popup',
  templateUrl: './account-address-popup.component.html',
  styleUrl: './account-address-popup.component.css'
})
export class AccountAddressPopupComponent {
  addressForm: FormGroup;

  addresses: any[] = [];
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AccountAddressPopupComponent>) {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      province: [''],
      district: [''],
      ward: [''],
      isDefault: [false]
    });
  }

  addAddress() {
    const newAddress = this.addressForm.value;
      console.log('Form Data:', newAddress);
    // Update the HTML to display the new address
    this.addresses.push(newAddress);
    console.log("list:", this.addresses)
  }
  closeDialog() {
    // // Get the form values when the "Thêm" button is clicked
    // const formData = this.addressForm.value;
    // console.log('Form Data:', formData);

    // Close the dialog and optionally send data back to the parent component
    this.dialogRef.close(/* any data you want to pass back to the parent component */);
  }


}
