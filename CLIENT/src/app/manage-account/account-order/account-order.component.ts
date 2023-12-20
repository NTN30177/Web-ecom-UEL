import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FeedbackOrderComponent } from './feedback-order/feedback-order.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';



@Component({
  selector: 'app-account-order',
  templateUrl: './account-order.component.html',
  styleUrl: './account-order.component.css'
})
export class AccountOrderComponent implements OnInit, AfterViewInit, OnDestroy {

  orders: any[] = [];
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',

  };
  dtTrigger: Subject<any> = new Subject<any>();

  // constructor(private orderService: OrderService) {}
  constructor(private router: Router,    public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.orderService.getOrders().subscribe((data) => {
    //   this.orders = data;
    //   this.dtTrigger.next();
    // });


    // Mock data:
    this.orders = [
      {
        id: '00001',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt',
        ],
        total: '2,930,000 ₫'
      },
      {
        id: '00002',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt',
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00003',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00004',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00005',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00005',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00005',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00005',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00005',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00005',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00005',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00005',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00005',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      {
        id: '00005',
        date: '19/12/2023 19:32:42',
        status: 'Đặt hàng thành công',
        products: [
          '1x Đầm phối đai phụ kiện, Tím nhạt',
          '1x Đầm phối đai phụ kiện, Tím nhạt'
        ],
        total: '2,887,000 ₫'
      },
      // Add more mock orders as needed
    ];

    this.orders.forEach(order => {
      order.totalProducts = order.products.length;
    });
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

  openFeedbackOrderDialog(): void{
    const dialogRef = this.dialog.open(FeedbackOrderComponent, {
      width: '70%',
    });

    // Handle the modal close event if needed
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
}
