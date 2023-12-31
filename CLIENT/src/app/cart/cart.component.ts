import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { formatMoneyVietNam, convertStringToNumbers } from '../utils/utils';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  formatMoneyVietNam = formatMoneyVietNam;
  convertStringToNumbers = convertStringToNumbers;

  rfDataModal: FormGroup;
  errFlag: boolean | undefined;
  showNocart = false;
  colorList: any;
  productsCart: any;
  errMessage: any;
  previousSize: any;
  previousColor: any;
  constructor(
    private _cartService: CartService,
    private fb: FormBuilder,
    private _authServer: AuthService
  ) {
    this.rfDataModal = this.fb.group({
      productName: ['', [Validators.required]],
      productSku: ['', [Validators.required]],
    });
  }
  async ngOnInit(): Promise<void> {
    try {
      await this.setupUserIdSubscription();
      this.productsCart = await this.apiCartProduct(this.userIdFromHeader);
      console.log(this.productsCart, 'pc');
      await this.cartDetails();
      await this.totalPayment(this.productsCart);
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }

  userIdFromHeader: any;
  private setupUserIdSubscription() {
    this._authServer.idUserSubject.subscribe((data) => {
      this.userIdFromHeader = data;
      console.log(data, 'UserIdFromHeader in CartComponent');
    });
  }

  async apiCartProduct(userIdFromHeader: any): Promise<void> {
    try {
      const data = await this._cartService
        .getProductCart(userIdFromHeader)
        .toPromise();
      this._cartService.updateCartItems(data.productItemUser);
      return data.productItemUser;
    } catch (err) {
      this.errMessage = err;
      this.showNocart = true;
    }
  }

  async changeQuantity(
    colorID: any,
    productID: any,
    sizeLIST: any,
    quantityACTION: any
  ) {
    const userData = await localStorage.getItem('userData');
    if (userData) {
      const parseUserData = JSON.parse(userData);
      this.userIdFromHeader = parseUserData._id;
    }
    const data = {
      colorId: colorID,
      productId: productID,
      size: sizeLIST,
      quantityAction: quantityACTION,
      userId: this.userIdFromHeader,
    };
    this._cartService.putProductItemCart(data).subscribe({
      next: async (data: any) => {
        this.productsCart = await this.apiCartProduct(this.userIdFromHeader);
        this.totalPayment(this.productsCart);
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }

  async onColorChange(
    event: any,
    currentColor: string,
    productId: string,
    size: string,
    quantity: number
  ) {
    try {
      const newColor = event.target.value;
      this.previousColor = newColor;
      await this.changeQuantity(newColor, productId, size, quantity);
      await this.changeQuantity(currentColor, productId, size, 0);
    } catch (err) {
      console.error(err);
    }
  }

  async onSizeChange(
    event: any,
    currentColor: string,
    productId: string,
    sizeCurrent: string,
    quantity: number
  ) {
    try {
      this.previousColor = sizeCurrent;
      const newSize = event.target.value;
      this.previousSize = newSize;

      // Assuming that changeQuantity returns a promise
      await this.changeQuantity(currentColor, productId, newSize, quantity);
      await this.changeQuantity(currentColor, productId, sizeCurrent, 0);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  getCartDetails: any = [];
  async cartDetails(): Promise<void> {
    const localCartString = localStorage.getItem('localCart');
    if (localCartString) {
      this.getCartDetails = JSON.parse(localCartString);
      console.log(this.getCartDetails, 'cart');
    }
  }

  total_payment: number = 0;
  total_quantity: number = 0;
  total_variantColor: number = 0;
  ship_code: number = 0;
  async totalPayment(productsCart: any): Promise<number> {
    console.log(this.productsCart, '1233');
    this.total_payment = 0;
    this.total_quantity = 0;
    this.total_variantColor = 0;
    this.ship_code = 0;
    productsCart.forEach((product: any) => {
      product.variants.forEach((variant: any) => {
        variant.variantColor.forEach((variantColor: any) => {
          this.total_variantColor++;
          this._authServer.cartSubject.next(this.total_quantity);
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
    this._authServer.updateCart(this.total_quantity);

    return this.total_payment;
  }

  removeProduct() {
    localStorage.removeItem('localCart');
    this.getCartDetails = [];
  }
}
