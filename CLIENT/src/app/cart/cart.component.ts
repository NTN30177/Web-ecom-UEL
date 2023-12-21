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
  previousSize: any;
  previousColor: any;
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
        console.log('test123')

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
        console.log(data,'dataput')
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
  async onColorChange(event: any, currentColor: string, productId: string, size: string, quantity: number) {
    try{
      const newColor = event.target.value;
      console.log('Trước khi chọn:', currentColor);
  
      console.log('Sau khi chọn:', newColor);
  
      this.previousColor = newColor;
      await this.changeQuantity(newColor,productId, size, quantity)
      await this.changeQuantity(currentColor,productId, size, 0)
      console.log('test change color')

    }catch(err){
      console.error(err);
    }
  }

  async onSizeChange(event: any, currentColor: string, productId: string, sizeCurrent: string, quantity: number) {
    try {
      this.previousColor = sizeCurrent;
      const newSize = event.target.value;
  
      console.log('Trước khi chọn:', currentColor, productId, sizeCurrent, quantity);
      console.log('Sau khi chọn:', newSize);
  
      this.previousSize = newSize;
  
      // Assuming that changeQuantity returns a promise
      await this.changeQuantity(currentColor, productId, newSize, quantity);
      console.log('test change size')
      await this.changeQuantity(currentColor, productId, sizeCurrent, 0);
      console.log(newSize, 'ns');

  

    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error appropriately
    }
  }
  

}
