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
import { ManageProductComponent } from './admin/manage-product/manage-product.component';
import { UserRoutingModule } from './user/user-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { AddressListPopupComponent } from './address-list-popup/address-list-popup.component';
import { AddProduct2Component } from './admin/add-product-2/add-product-2.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordModalComponent } from './login/forgot-password-modal/forgot-password-modal.component';
import { ForgotPasswordModalSuccessComponent } from './login/forgot-password-modal-success/forgot-password-modal-success.component';
import { CreateCampaignComponent } from './admin/create-campaign/create-campaign.component';
import { ManageCampaignComponent } from './admin/manage-campaign/manage-campaign.component';
import { MatButtonModule } from '@angular/material/button';









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
    AddProduct2Component,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordModalComponent,
    ForgotPasswordModalSuccessComponent,
    CreateCampaignComponent,
    ManageCampaignComponent,
    
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
    MatToolbarModule,
    PanelMenuModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatTabsModule,
    MatInputModule,
    MatSidenavModule,
    MatButtonModule,




  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
