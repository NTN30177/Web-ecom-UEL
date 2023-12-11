import { UserComponent } from './user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { HomePageComponent } from '../home-page/home-page.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { AccountInfoComponent } from './manage-account/account-info/account-info.component';
import { AccountAddressComponent } from '../account-address/account-address.component';
import { AccountOrderComponent } from '../account-order/account-order.component';
import { ManageProductComponent } from '../manage-product/manage-product.component';
import { AccountRoutingModule } from './manage-account/manage-account-routing.module';

const routes: Routes = [
  // { path: '', redirectTo: "/drink", pathMatch: 'full'},
  {
    path: '',
    component: UserComponent,
    children: [
      // { path: 'account', 
      // component: ManageAccountComponent, 
      // children: [
      //   { path: 'info', component: AccountInfoComponent },
      //   { path: 'address', component: AccountAddressComponent },
      // ]},
      { path: '', component: HomePageComponent },
      { path: '**', component: PageNotFoundComponent },
     
    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes),  AccountRoutingModule],
  exports: [RouterModule],
})
export class UserRoutingModule {}
