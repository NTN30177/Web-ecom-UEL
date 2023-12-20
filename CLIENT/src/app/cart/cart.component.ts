import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  rfDataModal: FormGroup;
  errFlag: boolean | undefined;
  colorList: any;
  productsCart: any;
  errMessage: any;
  constructor(private _cartService: CartService, private fb: FormBuilder) {
    this.rfDataModal = this.fb.group({
      productName: ['', [Validators.required]],
      productSku: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.apiCartProduct();
  }
  totalPayment() {
    return 1;
  }
  totalQuantity() {}
  apiCartProduct() {
    console.log('1235');
    this._cartService.getProductCart().subscribe({
      next: (data: any) => {
        this.productsCart = data.productItemUser;
        console.log(this.productsCart, '123');
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }
  apiChangeQuantityProductItem(data: object) {
    console.log(data, '55555');
    this._cartService.putProductItemCart(data).subscribe({
      next: (data: any) => {
        this.apiCartProduct();
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }
  changeQuantity(
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
    this.apiChangeQuantityProductItem(data);
  }
  convertStringToNumbers(string: string) {
    let valueNumber = string.replace(/[^\d]/g, "");
    return parseInt(valueNumber);
  }
  formatMoneyVietNam(so: number | bigint) {
    const valueString = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(so);
    return valueString;
  }
}
