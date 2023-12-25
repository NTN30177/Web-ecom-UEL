import { Component, OnInit } from '@angular/core';
// import { AccountAddressPopupComponent } from '../account-address-popup/account-address-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountAddressPopupComponent } from '../account-address-popup/account-address-popup.component';
import { IUserAddress } from '../../interfaces/user';
import { AccountAddressService } from '../../services/account-address.service';
import { AccountInfoService } from '../../services/account-info.service';

@Component({
  selector: 'app-account-address',
  templateUrl: './account-address.component.html',
  styleUrl: './account-address.component.css',
})
export class AccountAddressComponent implements OnInit {
  // @Input() userID: any;
  userID : any;
  addressList: IUserAddress[] = [];


  constructor(
    private dialogRef: MatDialog,
    private addressService: AccountAddressService,
    private accountInfoService: AccountInfoService,
    ) {
    // this.accountInfoService.userIDSubject.subscribe((data) => {
    //   this.userID = data;
    // });
  }

  ngOnInit(): void {

    this.accountInfoService.userId$.subscribe(userId => {
      this.userID = userId;
      console.log('Address component: User ID:', this.userID);
    });


    this.addressService.getUserAddressList(this.userID).subscribe(
      (data) => {
        this.addressList = data;
        console.log('addressService respond account address list:', this.addressList)
      },
      (error) => {
        console.error('Error fetching user addresses:', error);
      }
    );
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

  setDefaultAddress(){

  }
}
