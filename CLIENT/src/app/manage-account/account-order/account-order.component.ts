import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
// import { IOrder } from '../../interfaces/order';
import { OrderService } from '../../services/order.service';
import { AccountInfoService } from '../../services/account-info.service';
import { IOrders } from '../../interfaces/order';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-account-order',
  templateUrl: './account-order.component.html',
  styleUrl: './account-order.component.css'
})
export class AccountOrderComponent implements OnInit, AfterViewInit, OnDestroy {

  userID: any;
  orders: IOrders[] = [];

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',

  };
  dtTrigger: Subject<any> = new Subject<any>();

  // constructor(private orderService: OrderService) {}
  constructor(
    private router: Router, 
    private orderService: OrderService, 
    private _authService:AuthService) { }

  ngOnInit(): void {

    this._authService.idUserSubject.subscribe((data) => {
      this.userID = data;
      console.log(this.userID, 'user id:::')
    });

    this.orderService.getUserOrders(this.userID).subscribe(
      (data) => {
        this.orders = data;
        console.log('OrderService respond account order list:', this.orders);
        this.orders.forEach(order => {
          console.log('ORDER:', order);
        });
      },
      (error) => {
        console.error('Error fetching user orders:', error);
      }
    );

  }



  ngAfterViewInit(): void {
    const table = $('#dataTable');

    console.log('Table element:', table);

    if (!table || !table.length) {
      console.error('Table not found');
      return;
    }

    if (!table.DataTable()) {
      console.log('Inside DataTable initialization block');

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 7,
        lengthMenu: [3, 5, 7],
      };

      console.log('Initializing DataTable with options:', this.dtOptions);

      table.DataTable(this.dtOptions);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe the DataTable
    this.dtTrigger.unsubscribe();
  }

}
