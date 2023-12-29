import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ManageProductService } from '../../services/manage-product.service';
import { DataTableDirective } from 'angular-datatables';
import { IProduct, IVariant } from '../../interfaces/product';
import { local } from '../../ENV/envi';
import { formatMoneyVietNam } from '../../utils/utils';


@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css'
})
export class ManageProductComponent implements OnInit, OnDestroy {
  formatMoneyVietNam = formatMoneyVietNam;
  local = local

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

  // softDeleteProduct(productId: string): void {
  //   const productIndex = this.allProducts.findIndex(product => product.id === productId);
  //   if (productIndex !== -1) {
  //     this.allProducts[productIndex].deleted = true;
  //     // Add the deleted product to softDeletedProducts
  //     this.softDeletedProducts.push(this.allProducts[productIndex]);
  //     // Optionally, you can update your backend to handle soft deletion.
  //     // Make an API call to update the deleted status on the server.

  //     // Trigger DataTables rendering for both allProducts and softDeletedProducts
  //     this.dtTrigger.next(null);
  // }}

  // private getSoftDeletedProducts(): IProduct[] {
  //   return this.allProducts.filter(product => product.deleted);
  // }

  // softDeleteProduct(productId: string): void {
  //   console.log(productId)
  //   this.manageProductService.softDeleteProduct(productId).subscribe(() => {
  //     // Cập nhật is_deleted trong danh sách sản phẩm của bạn
  //     const productIndex = this.allProducts.findIndex(product => product._id === productId);
  //     if (productIndex !== -1) {
  //       if is_deleted = false :
  //       this.allProducts[productIndex].is_deleted = true;
  //       else: 
  //       this.allProducts[productIndex].is_deleted = false;
  //     }

  //     // Trigger DataTables rendering
  //     this.dtTrigger.next(null);
  //   });
  // }

  toggleIsDeleted(productId: string): void {
    // Find the product in the array
    const productIndex = this.allProducts.findIndex(product => product._id === productId);
    // Toggle the value of is_deleted
    this.allProducts[productIndex].is_deleted = !this.allProducts[productIndex].is_deleted;

    // Call the service method to toggle is_deleted on the server
    this.manageProductService.toggleIsDeleted(productId).subscribe(() => {
      // Trigger DataTables rendering
      // this.dtTrigger.next(null);
    });
  }

}
