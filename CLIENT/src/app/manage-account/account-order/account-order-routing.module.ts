import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountOrderComponent } from './account-order.component';

const routes: Routes = [
  {path: '', component: AccountOrderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountOrderRoutingModule { }
