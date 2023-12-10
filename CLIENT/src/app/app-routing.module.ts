import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';

const routes: Routes = [
  // { path: '', redirectTo: "/drink", pathMatch: 'full'},
  {path:'list-product', component:AddProductComponent},
  {path:'', component:HomePageComponent},
  {path:'**', component:PageNotFoundComponent},
  {path:'account', component:ManageAccountComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
