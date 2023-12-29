import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { IOrders } from '../../interfaces/order';
import { AuthService } from '../../services/auth.service';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-account-order',
  templateUrl: './account-order.component.html',
  styleUrls: ['./account-order.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AccountOrderComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  userID: any;
  orders: IOrders[] = [];

  constructor(
    public dialog: MatDialog,
    private orderService: OrderService,
    private _authService: AuthService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: true,
      // dom: 'lfrtip',
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
      },
    };

    this._authService.idUserSubject.subscribe((data) => {
      this.userID = data;
      // console.log(this.userID, 'user id:::')
    });

    this.getAccountOrder()

  }
  ngOnDestroy(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();

  getAccountOrder(): void {
    this.orderService.getUserOrders(this.userID).subscribe(
      (data) => {
        this.orders = data;
        // console.log('OrderService respond account order list:', this.orders);
        // this.orders.forEach(order => {
        //   console.log('ORDER:', order);
        // });
      },
      (error) => {
        console.error('Error fetching user orders:', error);
      }
    );
  }
}