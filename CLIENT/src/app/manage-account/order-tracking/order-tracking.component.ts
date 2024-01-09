import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { alertwarning, formatDate, formatMoneyVietNam } from '../../utils/utils';
import { FeedbackOrderComponent } from '../order-tracking/feedback-order/feedback-order.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { localProductImg } from '../../ENV/envi';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class OrderTrackingComponent implements OnInit{
  localProductImg=localProductImg
  formatMoneyVietNam=formatMoneyVietNam
  formatDate=formatDate
  alertwarning=alertwarning
  orderId: any;
  orderDetails: any;
  userId: any;
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];
      console.log( this.orderId)
      this.loadOrderDetails();
    });  }


    loadOrderDetails() {
      // Use your OrderService to fetch order details based on orderId
      this.orderService.getOrderDetails(this.orderId).subscribe(
        (data) => {
          this.orderDetails = data;
          console.log('Order details:', this.orderDetails)

          console.log('Order details:', data.dataWardDetail);
          console.log('Order details:', data);
        },
        (error) => {
          console.error('Error fetching order details:', error);
        }
      );
    }

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    public dialog: MatDialog,
    private _authService: AuthService,

  ) {}


  calculateDeliveryEstimate(isoString: string): string {
    const dateObject = new Date(isoString);
    dateObject.setDate(dateObject.getDate() + 5);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Months are zero-based
    const year = dateObject.getFullYear(); 
    return `${day}/${month}/${year}`;
  }
  openFeedbackOrderDialog(orderId: String, productId: String): void {
    console.log(productId, orderId)
    this._authService.idUserSubject.subscribe((data)=>
    {this.userId=data})

    const dialogRef = this.dialog.open(FeedbackOrderComponent, {
      width: '80%',
      data: { orderId: orderId, productId: productId, userId: this.userId},
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
  

}
