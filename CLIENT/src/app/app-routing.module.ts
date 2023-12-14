import { UserModule } from './user/user.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { UserComponent } from './user/user.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  // {path: '', redirectTo: '/home', pathMatch: 'full'},
  // {
  //   path: '', 
  //   component: UserComponent,
  //   children: [
  //     { 
  //       path: '',
  //       loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  //     }
  //   ]
  // } 
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
