import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { IOrders } from '../../interfaces/order';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css'],  // Fix styleUrl to styleUrls
  encapsulation: ViewEncapsulation.None,
})
export class ManageOrderComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  allOrders: IOrders[] = [];

  constructor(private _service: OrderService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: true,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
      },
    };

    this.orders();
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

  orders(): void {
    this._service.getOrders().subscribe((response: IOrders[]) => {
      this.allOrders = response;
      console.log(this.allOrders);
      // Trigger DataTables update after getting data
      this.dtTrigger.next(null);
    });
  }
}
