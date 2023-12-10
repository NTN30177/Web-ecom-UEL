import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddProductComponent } from './add-product/add-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './home-page/home-page.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountAddressComponent } from './account-address/account-address.component';
import { AccountOrderComponent } from './account-order/account-order.component';
import { AccountHelpComponent } from './account-help/account-help.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { AccountAddressPopupComponent } from './account-address-popup/account-address-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    ManageAccountComponent,
    AccountInfoComponent,
    AccountAddressComponent,
    AccountOrderComponent,
    AccountHelpComponent,
    ManageProductComponent,
    AccountAddressPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // Quan tọng, k có là k chạy
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
