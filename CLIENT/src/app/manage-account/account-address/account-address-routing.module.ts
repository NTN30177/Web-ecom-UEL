import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountAddressComponent } from './account-address.component';

const routes: Routes = [
  {path: '', component: AccountAddressComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountAddressRoutingModule { }
