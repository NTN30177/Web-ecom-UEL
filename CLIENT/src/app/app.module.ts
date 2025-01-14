import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from 'ngx-owl-carousel-o';
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
import { AddressListPopupComponent } from './payment/address-list-popup/address-list-popup.component';
import { AddProduct2Component } from './admin/add-product-2/add-product-2.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordModalComponent } from './login/forgot-password-modal/forgot-password-modal.component';
import { ForgotPasswordModalSuccessComponent } from './login/forgot-password-modal-success/forgot-password-modal-success.component';
import { CreateCampaignComponent } from './admin/create-campaign/create-campaign.component';
import { ManageCampaignComponent } from './admin/manage-campaign/manage-campaign.component';
import { MatButtonModule } from '@angular/material/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CartComponent } from './cart/cart.component';
import { AddColorComponent } from './admin/add-color/add-color.component';
import { FeedbackOrderComponent } from './manage-account/order-tracking/feedback-order/feedback-order.component';
import { FeedbackOrderSuccessComponent } from './manage-account/order-tracking/feedback-order-success/feedback-order-success.component';
import { OrderTrackingComponent } from './manage-account/order-tracking/order-tracking.component';
import { TermPolicyComponent } from './term-policy/term-policy.component';
import { ManageOrderComponent } from './admin/manage-order/manage-order.component';
import { DeliveryPolicyComponent } from './delivery-policy/delivery-policy.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ForgetPwComponent } from './forget-pw/forget-pw.component';
import { Select2Module } from 'ng-select2-component';
import { PaymentThankComponent } from './payment/payment-thank/payment-thank.component';
import { FilterProductComponent } from './filter-product/filter-product.component';
import { MatSliderModule } from '@angular/material/slider';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ManageUserComponent } from './admin/manage-user/manage-user.component';
import { NgxSliderModule } from 'ngx-slider-v2';
// import { NgxSliderModule } from '@angular-slider/ngx-slider';

// import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { Chart1Component } from './admin/chart-1/chart-1.component';
import { Chart2Component } from './admin/chart-2/chart-2.component';
import { ToastModule } from '@coreui/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PaginationComponent } from './pagination/pagination.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ValidateEmailComponent } from './validate-email/validate-email.component';
import { ValidateEmailPopupComponent } from './validate-email-popup/validate-email-popup.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
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
    CartComponent,
    AddColorComponent,
    FeedbackOrderComponent,
    FeedbackOrderSuccessComponent,
    OrderTrackingComponent,
    TermPolicyComponent,
    DeliveryPolicyComponent,
    ManageOrderComponent,
    DeliveryPolicyComponent,
    ForgetPwComponent,
    PaymentThankComponent,
    FilterProductComponent,

    ManageUserComponent,
    Chart1Component,
    Chart2Component,
    DashboardComponent,
    PaginationComponent,
    ProductDetailComponent,
    ValidateEmailComponent,
    ValidateEmailPopupComponent,
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
    CarouselModule,
    MatButtonModule,
    NzFormModule,
    CommonModule,
    Select2Module,
    MatSliderModule,
    MatSelectModule,
    NgxSliderModule,
    HighchartsChartModule,
    ToastModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    SlickCarouselModule,
    
  ],
  providers: [DatePipe, CartComponent, HomePageComponent, {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
  bootstrap: [AppComponent],
})
export class AppModule {}
