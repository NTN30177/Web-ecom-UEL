import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountAddressPopupComponent } from '../manage-account/account-address-popup/account-address-popup.component';
import { AddressListPopupComponent } from './address-list-popup/address-list-popup.component';
import { MethodListComponent } from './method-list/method-list.component';
import { CartService } from '../services/cart.service';
import { formatMoneyVietNam, convertStringToNumbers } from '../utils/utils';
import { AuthService } from '../services/auth.service';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  formatMoneyVietNam = formatMoneyVietNam;
  defaultAddress: any;
  cartItems: any[] = [];
  infoResult: any;
  errMessage: any;
  userId: any;

  constructor(
    private dialogRef: MatDialog,
    private _cartService: CartService,
    private _authService: AuthService,
    private _paymentService: PaymentService
  ) {}

  async ngOnInit(): Promise<void> {
    this._cartService.cartItems$.subscribe(async (cartItems) => {
      this.cartItems = cartItems;
      await this.getUserId(); // Chờ hàm này chạy xong trước khi tiếp tục
      await this.getAddressUser(); // Chờ hàm này chạy xong trước khi tiếp tục
      // Chờ hàm này chạy xong trước khi tiếp tục
      await this.totalPayment();

    });
  }

  getUserId() {
    this._authService.idUserSubject.subscribe((data) => {
      this.userId = data;
      // console.log(this.userId, 'uid');
    });
  }
  total_payment: number = 0;
  total_quantity: number = 0;
  total_variantColor: number = 0;
  ship_code: number = 0;
  async totalPayment(): Promise<void> {
    this.total_payment = 0;
    this.total_quantity = 0;
    this.total_variantColor = 0;
    this.ship_code = 0;
    this.cartItems.forEach((product: any) => {
      // console.log(product);
      product.variants.forEach((variant: any) => {
        variant.variantColor.forEach((variantColor: any) => {
          // console.log(variantColor);
          this.total_variantColor++;
          this._authService.cartSubject.next(this.total_quantity);
          // Assuming there is a 'price' property for each variant
          this.total_payment += variantColor.quantity * product.productId.price;
          this.total_quantity += variantColor.quantity;
        });
      });
    });
    if (this.total_payment > 1000000) {
      this.ship_code = 0;
    } else {
      this.ship_code = 35000;
    }
    // console.log(this.ship_code);
  }
  getAddressUser() {
    this._paymentService.getAddress(this.userId).subscribe({
      next: (responseData: any) => {
        this.addresses = responseData;
        this.setDefaultAddress();
        this._paymentService.addressSubject.next(responseData);
        // console.log(responseData, 'rđ');
      },
      error: (err: any) => {
        this.errMessage = err;
        console.log(this.errMessage);
      },
    });
  }

  buy() {
    const data = {
      cartItems: this.cartItems,
      addressId: this.addresses[0]._id,
      userId: this.userId,
    };
    const paymentSuccess ={ total_payment:this.total_payment ,
      total_quantity: this.total_quantity,
      total_variantColor: this.total_variantColor ,
      ship_code: this.ship_code 
    }
    
    this._paymentService.saveOrder(data).subscribe({
      next: (responseData: any) => {
        this.infoResult = responseData.message;
        const paymentSuccess ={ total_payment:this.total_payment ,
          total_quantity: this.total_quantity,
          total_variantColor: this.total_variantColor ,
          ship_code: this.ship_code ,
          orderId:responseData.orderId
        }
        // console.log(paymentSuccess)
        // console.log(responseData)
        this._paymentService.updateResultPayment([paymentSuccess]);

        // this._paymentService.paymentSuccessSubject.next(paymentSuccess);

      },
      error: (err: any) => {
        this.errMessage = err;
        console.log(this.errMessage);
      },
    });
  }

  addresses: any;

  setDefaultAddress() {
    this.defaultAddress = this.addresses.find((address: any) => {
      return address.is_default; // Return the value
    });
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

    dialogRef.componentInstance.addressSelected.subscribe(
      (selectedAddress: any) => {
        // console.log('Selected Address:', selectedAddress);
        // Update the default address in the parent component
        this.defaultAddress = selectedAddress;
      }
    );
  }

  openMethodSelectionPopup() {
    const dialogRef = this.dialogRef.open(MethodListComponent, {
      hasBackdrop: true,
    });
  }
}
