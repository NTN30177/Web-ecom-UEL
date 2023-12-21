import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ManageProductService } from '../../services/manage-product.service';
import { DataTableDirective } from 'angular-datatables';
import { IProduct, IVariant } from '../../interfaces/product';


@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css'
})
export class ManageProductComponent implements OnInit, OnDestroy {




  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  allProducts: IProduct[] = [];
  softDeletedProducts: IProduct[] = [];

  constructor(private manageProductService: ManageProductService) { }

  ngOnInit(): void {
    this.products();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
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

softDeleteProduct(productId: string): void {
  this.manageProductService.softDeleteProduct(productId).subscribe(() => {
    // Cập nhật is_deleted trong danh sách sản phẩm của bạn
    const productIndex = this.allProducts.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
      this.allProducts[productIndex].is_deleted = true;
    }

    // Trigger DataTables rendering
    this.dtTrigger.next(null);
  });
}
}
