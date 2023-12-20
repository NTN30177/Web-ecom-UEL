import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { MethodListComponent } from './method-list/method-list.component';


@NgModule({
  declarations: [
    MethodListComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule
  ]
})
export class PaymentModule { }
