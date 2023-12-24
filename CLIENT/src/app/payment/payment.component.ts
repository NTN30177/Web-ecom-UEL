import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountAddressPopupComponent } from '../manage-account/account-address-popup/account-address-popup.component';
import { AddressListPopupComponent } from './address-list-popup/address-list-popup.component';
import { MethodListComponent } from './method-list/method-list.component';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  defaultAddress: any;
  cartItems: any[] = [];

  constructor(private dialogRef: MatDialog,
    private _cartService: CartService) { }

  ngOnInit(): void {
    this.setDefaultAddress();
    this._cartService.cartItems$.subscribe(cartItems => {
      this.cartItems = cartItems;})
  }

  addresses = [
    {
      name: 'Phương Nguyên',
      phone: '0986428483',
      address: 'Tô Vĩnh Diện, Đông Hoà, Dĩ An, Bình Dương',
      isDefault: true,
    },
    {
      name: 'Phương Nhi',
      phone: '0986838999',
      address: 'Tô Vĩnh Diện, Đông Hoà, Dĩ An, Bình Dương',
      isDefault: false,
    },
  ];

  setDefaultAddress() {
    this.defaultAddress = this.addresses.find((address) => address.isDefault);
  }

  openDialog() {
    // Check if there are open dialogs before opening a new one
    if (this.dialogRef.openDialogs.length === 0) {
      const dialogRef = this.dialogRef.open(AccountAddressPopupComponent, {
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('Dialog result:', result);
      });
    }
  }
  openAddressSelectionPopup() {
    const dialogRef = this.dialogRef.open(AddressListPopupComponent, {
      hasBackdrop: true,
    });

    dialogRef.componentInstance.addressSelected.subscribe((selectedAddress: any) => {
      console.log('Selected Address:', selectedAddress);
      // Update the default address in the parent component
      this.defaultAddress = selectedAddress;
    });
  }

  openMethodSelectionPopup() {
    const dialogRef = this.dialogRef.open(MethodListComponent, {
      hasBackdrop: true,
    });
  }
}
