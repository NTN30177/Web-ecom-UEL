import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderTrackingComponent } from './order-tracking.component';

const routes: Routes = [
  {path:'', component: OrderTrackingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderTrackingRoutingModule { }
