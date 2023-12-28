import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageAccountRoutingModule } from './manage-account-routing.module';
import { AccountFavoriteComponent } from './account-favorite/account-favorite.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


@NgModule({
  declarations: [
    AccountFavoriteComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ManageAccountRoutingModule
  ]
})
export class ManageAccountModule { }
