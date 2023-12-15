import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { HomePageComponent } from '../home-page/home-page.component';
import { ViewColorComponent } from './view-color/view-color.component';
import { ManageAccountComponent } from '../manage-account/manage-account.component';
import { AccountInfoComponent } from '../manage-account/account-info/account-info.component';
import { AccountAddressComponent } from '../manage-account/account-address/account-address.component';
import { AccountOrderComponent } from '../manage-account/account-order/account-order.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { AdminComponent } from './admin.component';
import { AddProduct2Component } from './add-product-2/add-product-2.component';
import { CreateCampaignComponent } from '../create-campaign/create-campaign.component';

const routes: Routes = [
  // { path: '', redirectTo: "/drink", pathMatch: 'full'},
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'add-product', component: AddProductComponent },
      { path: 'add-product-2', component: AddProduct2Component },
      { path: 'view-color', component: ViewColorComponent },
      { path: 'product', component: ManageProductComponent },
      { path: 'create-campaign', component: CreateCampaignComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
