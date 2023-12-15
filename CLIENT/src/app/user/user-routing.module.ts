import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { HomePageComponent } from '../home-page/home-page.component';
import { ManageAccountComponent } from '../manage-account/manage-account.component';
import { AccountInfoComponent } from '../manage-account/account-info/account-info.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AccountAddressComponent } from '../manage-account/account-address/account-address.component';
import { PaymentComponent } from '../payment/payment.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'account',
        loadChildren: () =>
          import('../manage-account/manage-account.module').then(
            (m) => m.ManageAccountModule
          ),
      },
      {
        path:'payment', component: PaymentComponent,
      },
      {
        path:'login', component: LoginComponent,
      },
      {
        path:'register', component: RegisterComponent,
      },
      {
        path: '',
        component: HomePageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
