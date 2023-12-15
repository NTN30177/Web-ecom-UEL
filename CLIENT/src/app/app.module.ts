import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HeaderAdminComponent } from './admin/header-admin/header-admin.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './home-page/home-page.component';
import { BtnManageComponent } from './btn-manage/btn-manage.component';
import { ViewColorComponent } from './admin/view-color/view-color.component';
import { DataTablesModule } from 'angular-datatables';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { AccountInfoComponent } from './manage-account/account-info/account-info.component';
import { AccountAddressComponent } from './manage-account/account-address/account-address.component';
import { AccountOrderComponent } from './manage-account/account-order/account-order.component';
import { AccountHelpComponent } from './manage-account/account-help/account-help.component';
import { AccountAddressPopupComponent } from './manage-account/account-address-popup/account-address-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { UserModule } from './user/user.module';
import { UserRoutingModule } from './user/user-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { AddressListPopupComponent } from './address-list-popup/address-list-popup.component';

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
    PaymentComponent,
    AddressListPopupComponent,
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
