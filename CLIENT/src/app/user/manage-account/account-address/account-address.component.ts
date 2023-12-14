import { Component } from '@angular/core';
import { AccountAddressPopupComponent } from '../account-address-popup/account-address-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-account-address',
  templateUrl: './account-address.component.html',
  styleUrl: './account-address.component.css'
})
export class AccountAddressComponent {

  constructor(private  dialogRef : MatDialog){}

  addresses = [
    {
      name: 'Phương Nguyên',
      phone: '0986428483',
      address: 'Tô Vĩnh Diện, Đông Hoà, Dĩ An, Bình Dương',
      isDefault: false
    },
    {
      name: 'Phương Nhi',
      phone: '0986838999',
      address: 'Tô Vĩnh Diện, Đông Hoà, Dĩ An, Bình Dương',
      isDefault: false
    }
  ];

  setDefaultAddress(index: number) {
    // Đặt địa chỉ tại vị trí 'index' làm mặc định
    this.addresses.forEach((address, i) => {
      address.isDefault = i === index;
    });
  }
  openDialog() {
    // Check if there are open dialogs before opening a new one
    if (this.dialogRef.openDialogs.length === 0) {
      const dialogRef = this.dialogRef.open(AccountAddressPopupComponent, {
        hasBackdrop: true,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog result:', result);
      });
    }
  }


}
