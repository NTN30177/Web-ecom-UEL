import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAccountComponent } from './manage-account.component';
import { AccountInfoComponent } from './account-info/account-info.component';

const routes: Routes = [
  //  {
  //     path: '',
  //     component: ManageAccountComponent,
  //     children: [
  //       // { path: '', redirectTo: 'info', pathMatch: 'full' },
  //       { path: 'info', component: AccountInfoComponent, outlet: 'side' },
  //     ],
  //   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAccountRoutingModule { }
