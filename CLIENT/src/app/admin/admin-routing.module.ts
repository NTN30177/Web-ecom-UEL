import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewColorComponent } from './view-color/view-color.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { AdminComponent } from './admin.component';
import { AddProduct2Component } from './add-product-2/add-product-2.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { ManageCampaignComponent } from './manage-campaign/manage-campaign.component';
import { AddColorComponent } from './add-color/add-color.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  // { path: '', redirectTo: "/drink", pathMatch: 'full'},
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'add-product-2', component: AddProduct2Component },
      { path: 'view-color', component: ViewColorComponent },
      { path: 'product', component: ManageProductComponent },
      { path: 'create-campaign', component: CreateCampaignComponent },
      { path: 'manage-campaign', component: ManageCampaignComponent },
      { path: 'manage-product', component: ManageProductComponent },
      { path: 'add-color', component: AddColorComponent },
      { path: 'manage-order', component: ManageOrderComponent },
      { path: 'manage-user', component: ManageUserComponent },
      { path: 'dashboard', component: DashboardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
