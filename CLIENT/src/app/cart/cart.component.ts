import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
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
    private _auth: AuthService
  ) {
    this.rfDataModal = this.fb.group({
      productName: ['', [Validators.required]],
      productSku: ['', [Validators.required]],
    });
  }
  async ngOnInit(): Promise<void> {
    try {
      await this.apiCartProduct();
      await this.cartDetails();
      await this.totalPayment();
    } catch (error) {
      // Handle errors if necessary
      console.error('Error in ngOnInit:', error);
    }
  }

  totalQuantity() {}
  async apiCartProduct(): Promise<void> {
    console.log('1235');
    try {
      const data = await this._cartService.getProductCart().toPromise();
      console.log('test123');
      this.productsCart = data.productItemUser;
      console.log(this.productsCart, '123');
    } catch (err) {
      this.errMessage = err;
      this.showNocart=true
    }
  }

  async apiChangeQuantityProductItem(data: object) {
    console.log(data, '55555');

    try {
      const responseData = await this._cartService
        .putProductItemCart(data)
        .toPromise();
      console.log(responseData, 'dataput');
      await this.apiCartProduct();
      await this.totalPayment();
    } catch (err) {
      this.errMessage = err;
    }
  }

  async changeQuantity(
    colorID: any,
    productID: any,
    sizeLIST: any,
    quantityACTION: any
  ) {
    const data = {
      colorId: colorID,
      productId: productID,
      size: sizeLIST,
      quantityAction: quantityACTION,
    };
    console.log(data, '123');
    await this.apiChangeQuantityProductItem(data);
  }
  convertStringToNumbers(string: string) {
    let valueNumber = string.replace(/[^\d]/g, '');
    return parseInt(valueNumber);
  }
  formatMoneyVietNam(so: number | bigint) {
    const valueString = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(so);
    return valueString;
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
      console.log('Trước khi chọn:', currentColor);

      console.log('Sau khi chọn:', newColor);

      this.previousColor = newColor;
      await this.changeQuantity(newColor, productId, size, quantity);
      console.log('test change color 2');

      await this.changeQuantity(currentColor, productId, size, 0);
      console.log('test change color');
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

      console.log(
        'Trước khi chọn:',
        currentColor,
        productId,
        sizeCurrent,
        quantity
      );
      console.log('Sau khi chọn:', newSize);

      this.previousSize = newSize;

      // Assuming that changeQuantity returns a promise
      await this.changeQuantity(currentColor, productId, newSize, quantity);
      console.log('test change size');
      await this.changeQuantity(currentColor, productId, sizeCurrent, 0);
      console.log(newSize, 'ns');
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error appropriately
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
  async totalPayment(): Promise<void> {
    console.log(this.productsCart, '1233');
    this.total_payment = 0;
    this.total_quantity = 0;
    this.total_variantColor = 0;
    this.ship_code = 0;

    // const localCartString = localStorage.getItem('localCart');
    // if(localCartString){

    //   this.getCartDetails =JSON.parse(localCartString)
    //   this.total = this.getCartDetails.reduce(function(acc: number,val: { quantity: number; price: number; }){
    //     return acc +(val.quantity*val.price)

    //   })
    this.productsCart.forEach((product: any) => {
      console.log(product);
      product.variants.forEach((variant: any) => {
        variant.variantColor.forEach((variantColor: any) => {
          console.log(variantColor);
          this.total_variantColor++;
          this._auth.cartSubject.next(this.total_variantColor);
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
    console.log(this.ship_code);
  }
  removeProduct(){
    localStorage.removeItem('localCart')
    this.getCartDetails =[]
  }
}
