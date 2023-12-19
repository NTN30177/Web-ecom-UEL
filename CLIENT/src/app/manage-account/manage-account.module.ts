import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageAccountRoutingModule } from './manage-account-routing.module';
import { AccountFavoriteComponent } from './account-favorite/account-favorite.component';


@NgModule({
  declarations: [
    AccountFavoriteComponent
  ],
  imports: [
    CommonModule,
    ManageAccountRoutingModule
  ]
})
export class ManageAccountModule { }
