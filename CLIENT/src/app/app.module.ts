import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './user/header/header.component';
import { HeaderAdminComponent } from './admin/header-admin/header-admin.component';
import { FooterComponent } from './user/footer/footer.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './home-page/home-page.component';
import { BtnManageComponent } from './btn-manage/btn-manage.component';
import { ViewColorComponent } from './admin/view-color/view-color.component';
import { DataTablesModule } from 'angular-datatables';
import { ManageAccountComponent } from './user/manage-account/manage-account.component';
import { AccountInfoComponent } from './user/manage-account/account-info/account-info.component';
import { AccountAddressComponent } from './user/manage-account/account-address/account-address.component';
import { AccountOrderComponent } from './account-order/account-order.component';
import { AccountHelpComponent } from './account-help/account-help.component';
import { AccountAddressPopupComponent } from './account-address-popup/account-address-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { SideMenuComponent } from './user/manage-account/side-menu/side-menu.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { UserModule } from './user/user.module';
import { UserRoutingModule } from './user/user-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    AddProductComponent,
    HeaderComponent,
    HeaderAdminComponent,
    FooterComponent,
    SidebarComponent,
    PageNotFoundComponent,
    HomePageComponent,
    BtnManageComponent,
    ViewColorComponent,
    ManageAccountComponent,
    AccountInfoComponent,
    AccountAddressComponent,
    AccountOrderComponent,
    AccountHelpComponent,
    ManageProductComponent,
    AccountAddressPopupComponent,
    UserComponent,
    AdminComponent,
    SideMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, // Quan tọng, k có là k chạy
    DataTablesModule,
    BrowserAnimationsModule, // Quan tọng, k có là k chạy
    MatDialogModule,
    AdminRoutingModule,
    // UserModule,
    UserRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
