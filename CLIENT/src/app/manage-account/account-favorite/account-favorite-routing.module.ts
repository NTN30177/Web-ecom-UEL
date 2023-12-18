import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountFavoriteComponent } from './account-favorite.component';

const routes: Routes = [
  {path:'', component: AccountFavoriteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountFavoriteRoutingModule { }
