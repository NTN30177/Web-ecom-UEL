import { Component, OnInit } from '@angular/core';
// import { AccountAddressPopupComponent } from '../account-address-popup/account-address-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountAddressPopupComponent } from '../account-address-popup/account-address-popup.component';
import { IUserAddress } from '../../interfaces/user';
import { AccountAddressService } from '../../services/account-address.service';
import { AuthService } from '../../services/auth.service';
import { alertwarning} from '../../utils/utils';
@Component({
  selector: 'app-account-address',
  templateUrl: './account-address.component.html',
  styleUrl: './account-address.component.css',
})
export class AccountAddressComponent implements OnInit {
  // @Input() userID: any;
  userID: any;
  addressList: IUserAddress[] = [];

  alertwarning=alertwarning
  constructor(
    private dialogRef: MatDialog,
    private addressService: AccountAddressService,
    private _authService: AuthService
  ) { }
  ngOnInit(): void {

    this._authService.idUserSubject.subscribe((data) => {
      this.userID = data;
      // console.log(this.userID, 'user id:::')
    });
    this.getAddressList()
  }

  getAddressList() {
    this.addressService.getUserAddressList(this.userID).subscribe(
      (data) => {
        this.addressList = data;

        this.addressList.sort((a, b) => {
          if (a.is_default) {
            return -1;
          } else if (b.is_default) {
            return 1; 
          } else {
            return 0;
          }
        });
        // console.log('addressService respond account address list:', this.addressList)
      },
      (error) => {
        console.error('Error fetching user addresses:', error);
      }
    );
  }
  openDialog() {
    if (this.dialogRef.openDialogs.length === 0) {
      const dialogRef = this.dialogRef.open(AccountAddressPopupComponent, {
        hasBackdrop: true,
      });

      // Subscribe to the addressAdded event emitted by the popup
      // dialogRef.componentInstance.addressAdded.subscribe((newAddress) => {
      //   console.log('New address added:', newAddress);
      //   this.updateAddressList(newAddress);
      // });


      dialogRef.afterClosed().subscribe((result) => {
        // console.log('Dialog result:', result);
      });
    }
  }

  updateAddressList(newAddress: any) {
    // Add the new address to the list
    this.addressList.push(newAddress);
  }

  setDefaultAddress(addressId: string): void {
    this.addressService.setDefaultAddress(this.userID, addressId).subscribe(
      (response) => {
        console.log('Default address set successfully:', response);
        // You can update your component's address list if needed
        this.getAddressList();
      },
      (error) => {
        console.error('Error setting default address:', error);
      }
    );
  }
  deleteAddress(addressId: string): void {
    const confirmation = window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?');
  
    if (confirmation) {
      this.addressService.deleteAddress(addressId).subscribe(
        () => {
          console.log('Address deleted successfully');
          this.getAddressList(); // Refresh the address list after deleting an address
        },
        (error) => {
          console.error('Error deleting address:', error);
        }
      );
    }
  }


}
