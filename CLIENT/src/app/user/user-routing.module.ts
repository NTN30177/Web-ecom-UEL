import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { HomePageComponent } from '../home-page/home-page.component';

import { PaymentComponent } from '../payment/payment.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { CartComponent } from '../cart/cart.component';
import { OrderTrackingComponent } from '../manage-account/order-tracking/order-tracking.component';
import { TermPolicyComponent } from '../term-policy/term-policy.component';
import { DeliveryPolicyComponent } from '../delivery-policy/delivery-policy.component';
import { ForgotPasswordModalSuccessComponent } from '../login/forgot-password-modal-success/forgot-password-modal-success.component';

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
        path:'forgot-pw', component: ForgotPasswordModalSuccessComponent,
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
