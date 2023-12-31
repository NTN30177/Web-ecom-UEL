import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { formatMoneyVietNam } from '../../utils/utils';
import { FeedbackOrderComponent } from '../order-tracking/feedback-order/feedback-order.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { data } from 'jquery';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class OrderTrackingComponent implements OnInit{
  formatMoneyVietNam=formatMoneyVietNam

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
          console.log('Order details:', this.orderDetails);

          const createdAt = this.orderDetails.dataOrderDetail[0].createdAt;
          const formattedDate = this.formatDate(createdAt);
          this.orderDetails.dataOrderDetail[0].createdAt = formattedDate;

          // console.log('Order details:', data.dataWardDetail);
          // console.log('Order details:', data);
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

  formatDate(isoString: string): string {
    const dateObject = new Date(isoString);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; 
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  cancelOrder(){
    alert("Chức năng đang được phát triển!")
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
