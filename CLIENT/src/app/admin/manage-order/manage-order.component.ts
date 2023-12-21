import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.css',
  encapsulation: ViewEncapsulation.None,
})

export class ManageOrderComponent implements OnInit{

  orders: any[] = [];
  dtOptions: DataTables.Settings = {};



  ngOnInit(): void{
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: true,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
      },
    };
    this.orders=[
      {
        "orderId": "ORD001",
        "status": "Đã huỷ đơn hàng",
        "quantity": 3,
        "customer": "Nguyễn Văn A",
        "trackingCode": "TRK123456789"
      },
      {
        "orderId": "ORD002",
        "status": "Giao hàng thành công",
        "quantity": 1,
        "customer": "Trần Thị B",
        "trackingCode": "TRK987654321"
      },
      {
        "orderId": "ORD003",
        "status": "Đang vận chuyển",
        "quantity": 2,
        "customer": "Lê Văn C",
        "trackingCode": "TRK456789123"
      },
      {
        "orderId": "ORD004",
        "status": "Chờ xác nhận",
        "quantity": 4,
        "customer": "Phạm Thị D",
        "trackingCode": "TRK789123456"
      },
      {
        "orderId": "ORD005",
        "status": "Chờ xác nhận",
        "quantity": 1,
        "customer": "Trần Văn E",
        "trackingCode": "TRK654321789"
      },
      {
        "orderId": "ORD006",
        "status": "Đã nhận hàng",
        "quantity": 2,
        "customer": "Lê Thị F",
        "trackingCode": "TRK987654321"
      },
      {
        "orderId": "ORD007",
        "status": "Chờ xác nhận",
        "quantity": 3,
        "customer": "Nguyễn Văn G",
        "trackingCode": "TRK123789456"
      },
      {
        "orderId": "ORD008",
        "status": "Đang đóng gói",
        "quantity": 2,
        "customer": "Hoàng Thị H",
        "trackingCode": "TRK456789321"
      },
      {
        "orderId": "ORD009",
        "status": "Đang vận chuyển",
        "quantity": 1,
        "customer": "Đỗ Văn I",
        "trackingCode": "TRK321789456"
      },
      {
        "orderId": "ORD010",
        "status": "Chờ xác nhận",
        "quantity": 3,
        "customer": "Trịnh Thị K",
        "trackingCode": "TRK456321789"
      },
      {
        "orderId": "ORD011",
        "status": "Đã huỷ đơn hàng",
        "quantity": 2,
        "customer": "Bùi Văn L",
        "trackingCode": "TRK789654321"
      },
      {
        "orderId": "ORD012",
        "status": "Giao hàng thành công",
        "quantity": 1,
        "customer": "Vũ Thị M",
        "trackingCode": "TRK456123789"
      },
      {
        "orderId": "ORD013",
        "status": "Đang vận chuyển",
        "quantity": 2,
        "customer": "Lý Văn N",
        "trackingCode": "TRK789456123"
      },
      {
        "orderId": "ORD014",
        "status": "Chờ xác nhận",
        "quantity": 3,
        "customer": "Nguyễn Thị P",
        "trackingCode": "TRK321456789"
      },
      {
        "orderId": "ORD015",
        "status": "Đang vận chuyển",
        "quantity": 1,
        "customer": "Phan Văn Q",
        "trackingCode": "TRK987321654"
      },
      {
        "orderId": "ORD016",
        "status": "Giao hàng thành công",
        "quantity": 2,
        "customer": "Trần Thị R",
        "trackingCode": "TRK654987321"
      },
      {
        "orderId": "ORD017",
        "status": "Đã huỷ đơn hàng",
        "quantity": 3,
        "customer": "Đặng Văn S",
        "trackingCode": "TRK321654987"
      },
      {
        "orderId": "ORD018",
        "status": "Đang vận chuyển",
        "quantity": 2,
        "customer": "Mai Thị T",
        "trackingCode": "TRK987654321"
      },
      {
        "orderId": "ORD019",
        "status": "Đã huỷ đơn hàng",
        "quantity": 1,
        "customer": "Lưu Văn U",
        "trackingCode": "TRK654321987"
      },
      {
        "orderId": "ORD020",
        "status": "Giao hàng thành công",
        "quantity": 3,
        "customer": "Nguyễn Thị V",
        "trackingCode": "TRK321987654"
      }
    ]

  }

  ngAfterViewInit(): void {
    // Khởi tạo DataTables trong hàm này để đảm bảo rằng DOM đã được tạo xong
    $('#manage-orders').DataTable({
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
      },
    });
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



  

}
