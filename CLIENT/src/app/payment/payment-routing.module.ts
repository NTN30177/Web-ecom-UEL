import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentThankComponent } from './payment-thank/payment-thank.component';

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
