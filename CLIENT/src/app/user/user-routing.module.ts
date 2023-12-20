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
import { CartComponent } from '../cart/cart.component';
import { OrderTrackingComponent } from '../order-tracking/order-tracking.component';
import { TermPolicyComponent } from '../term-policy/term-policy.component';
import { DeliveryPolicyComponent } from '../delivery-policy/delivery-policy.component';

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
        path:'cart', component: CartComponent,
      },
      {
        path: 'order-tracking', component: OrderTrackingComponent,
      },
      {
        path: 'term-policy', component: TermPolicyComponent,
      },
      {
        path: 'delivery-policy', component: DeliveryPolicyComponent,
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
