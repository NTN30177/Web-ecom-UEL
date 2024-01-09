import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';
import { formatMoneyVietNam } from '../../utils/utils';


@Component({
  selector: 'app-payment-thank',
  templateUrl: './payment-thank.component.html',
  styleUrl: './payment-thank.component.css'
})
export class PaymentThankComponent {
  formatMoneyVietNam = formatMoneyVietNam;

  orderInfo: any;
  emailUser: any;
  constructor(public _paymentService:PaymentService,
    public _authService:AuthService){
  }

  ngOnInit():void{
    this.getOrderInfo()
    this.getEmail()
  }

  getOrderInfo() {
    this._paymentService.resultPayment$.subscribe(async (orderInfo) => {
      this.orderInfo = orderInfo[0];
      // console.log(this.orderInfo, 'orderInfo');

     

    });

  }
  getEmail() {
    this._authService.emailUserSubject.subscribe((data:any) => {
      this.emailUser = data;
      // console.log(this.emailUser, 'emailUser');
    });
  }
}
