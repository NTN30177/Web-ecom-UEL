import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { HomePageComponent } from '../home-page/home-page.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { AccountInfoComponent } from './manage-account/account-info/account-info.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AccountAddressComponent } from './manage-account/account-address/account-address.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', component: HomePageComponent },
      {
        path: 'account',
        component: ManageAccountComponent,
        children: [
          // { path: '', redirectTo: 'info', pathMatch: 'full' },
          { path: 'info', component: AccountInfoComponent },
          { path: 'address', component: AccountAddressComponent },
        ],
      },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
