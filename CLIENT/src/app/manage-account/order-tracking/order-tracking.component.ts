import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css',
  encapsulation: ViewEncapsulation.None
})
export class OrderTrackingComponent implements OnInit{

  orderId: any;
  orderDetails: any;

  constructor(private route: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];
      this.loadOrderDetails();
    });  }


    loadOrderDetails() {
      // Use your OrderService to fetch order details based on orderId
      this.orderService.getOrderDetails(this.orderId).subscribe(
        (data) => {
          this.orderDetails = data;
          console.log('Order details:', this.orderDetails);
        },
        (error) => {
          console.error('Error fetching order details:', error);
        }
      );
    }

}
