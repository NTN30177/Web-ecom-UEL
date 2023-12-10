import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ViewColorComponent } from './view-color/view-color.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountAddressComponent } from './account-address/account-address.component';
import { AccountOrderComponent } from './account-order/account-order.component';
import { ManageProductComponent } from './manage-product/manage-product.component';

const routes: Routes = [
  // { path: '', redirectTo: "/drink", pathMatch: 'full'},
  {path:'admin/add-product', component:AddProductComponent},
  {path:'admin/view-color', component:ViewColorComponent},
  {path:'admin/product', component:ManageProductComponent},
  {path:'account', component:ManageAccountComponent},
  {path:'account/info', component:AccountInfoComponent},
  {path:'account/address', component:AccountAddressComponent},
  {path:'account/order', component:AccountOrderComponent},
  {path:'', component:HomePageComponent},
  {path:'**', component:PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
