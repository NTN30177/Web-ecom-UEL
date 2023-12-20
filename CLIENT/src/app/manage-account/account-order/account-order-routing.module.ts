import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountOrderComponent } from './account-order.component';
import { OrderTrackingComponent } from '../order-tracking/order-tracking.component';

const routes: Routes = [
  {path: '', component: AccountOrderComponent},
  {path: 'order-tracking', component: OrderTrackingComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountOrderRoutingModule { }
