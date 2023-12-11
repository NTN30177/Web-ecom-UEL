import { RouterModule, Routes } from "@angular/router";
import { ManageAccountComponent } from "./manage-account.component";
import { AccountInfoComponent } from "./account-info/account-info.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
      path: 'account',
      component: ManageAccountComponent,
      children: [
        { path: 'info', component: AccountInfoComponent, outlet: 'side' },
        // { path: 'address', component: AccountAddressComponent },
      ],
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class AccountRoutingModule {}