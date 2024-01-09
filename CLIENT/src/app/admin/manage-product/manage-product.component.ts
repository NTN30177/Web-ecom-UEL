import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ManageProductService } from '../../services/manage-product.service';
import { DataTableDirective } from 'angular-datatables';
import { IProduct, IVariant } from '../../interfaces/product';
import { local } from '../../ENV/envi';
import { alertwarning, formatMoneyVietNam } from '../../utils/utils';


@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css'
})
export class ManageProductComponent implements OnInit, OnDestroy {
  formatMoneyVietNam = formatMoneyVietNam;
  local = local
  alertwarning=alertwarning
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  allProducts: IProduct[] = [];
  softDeletedProducts: IProduct[] = [];

  constructor(private manageProductService: ManageProductService) { }

  ngOnInit(): void {
    this.products();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: true,
      // dom: 'lfrtip',
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
      },
    };


  }


  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;



  ngOnDestroy(): void {
    // Ensure that the DataTable instance is destroyed when the component is destroyed
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
  }


  products(): void {
    this.manageProductService.getProducts().subscribe((response: IProduct[]) => {
      this.allProducts = response;
      console.log(this.allProducts)
      this.dtTrigger.next(null);
    });
  }


  getInstockProducts(): IProduct[] {
    return this.allProducts.filter(product => this.getTotalQuantity(product.variants) > 0);
  }

  getOutofstockProducts(): IProduct[] {
    return this.allProducts.filter(product => this.getTotalQuantity(product.variants) === 0);
  }

  getDeletedProducts(): IProduct[] {
    return this.allProducts.filter(product => product.is_deleted);
  }

  getTotalQuantity(variants: IVariant[]): number {
    let totalQuantity = 0;
    for (const variant of variants) {
      for (const variantColor of variant.variantColor) {
        totalQuantity += variantColor.quantity;
      }
    }
    return totalQuantity;
  }


  toggleIsDeleted(productId: string): void {
    const productIndex = this.allProducts.findIndex(product => product._id === productId);
    this.allProducts[productIndex].is_deleted = !this.allProducts[productIndex].is_deleted;
    this.manageProductService.toggleIsDeleted(productId).subscribe(() => {

    });
  }

}
