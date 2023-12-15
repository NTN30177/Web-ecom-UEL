import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAccountComponent } from './manage-account.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountAddressComponent } from './account-address/account-address.component';

const routes: Routes = [
  {
    path: '',
    component: ManageAccountComponent,
    children: [
      {
        path: 'info',
        loadChildren: () =>
          import('./account-info/account-info.module').then(
            (m) => m.AccountInfoModule
          ),
      },
      {
        path: 'order',
        loadChildren: () =>
          import('./account-order/account-order.module').then(
            (m) => m.AccountOrderModule
          ),
      },
      {
        path: 'address',
        loadChildren: () =>
          import('./account-address/account-address.module').then(
            (m) => m.AccountAddressModule
          ),
      },
      {
        path: 'help',
        loadChildren: () =>
          import('./account-help/account-help.module').then(
            (m) => m.AccountHelpModule
          ),
      },
      { path: '', redirectTo: 'info', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAccountRoutingModule {}