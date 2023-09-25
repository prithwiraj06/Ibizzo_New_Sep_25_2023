// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material";
// Core Module
import { CoreModule } from "../../../../core/core.module";
import { PartialsModule } from "../../../partials/partials.module";
import { DashboardComponent } from "./dashboard.component";
import { UserProfileDetailsComponent } from "./user-profile-details/user-profile-details.component";
import { NgxTinymceModule } from "ngx-tinymce";
import { TagInputModule } from "ngx-chips";
import { PaymentjsModule } from "paymentjs";
import {
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatButtonModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
} from "@angular/material";
import { SharedComponentModule } from "../../shared-component/shared-component.module";
import { DashboardWidgetComponent } from "./widget/widget.component";
import { SubscriptionListComponent } from "./subscription/list/list.component";
import {
  MatTableModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatSelectModule,
} from "@angular/material";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { SalesListComponent } from "./sales-list/sales-list.component";
import { BaseComponent } from "./base/base.component";
import { ErrorComponent } from "./error/error.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RfqComponent } from "./purchase/rfq/rfq.component";
import { NgxTagsInputModule } from "ngx-tags-input";
import { CartDetailsComponent } from "./cart-details/cart-details.component";
import { QuoteDetailsComponent } from "./quote-details/quote-details.component";
import { SellerEnquiryComponent } from "./seller-enquiry/seller-enquiry.component";
import { PurchaserEnquiryComponent } from "./purchaser-enquiry/purchaser-enquiry.component";
import { PaymentSuccessComponent } from "./payment-success/payment-success.component";
import { PaymentErrorComponent } from "./payment-error/payment-error.component";
import { MembersListComponent } from "./members-list/members-list.component";
import { MatCardModule } from "@angular/material/card";
import { CreateGroupComponent } from "./create-group/create-group.component";
import { PurchaseListComponent } from "./purchase/purchase-list/purchase-list.component";
import { BusinessAuthGuard } from "./business-auth-guard";
import { InvoiceComponent } from "./invoice/invoice.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppPipesModule } from "./../../../../app-pipes.modules";
import { DigitalFlyerComponent } from "./digital-flyers/digital-flyer.component";
import { TellBuyersComponent } from "./tell-buyers/tell-buyers.component";
import { ProductHistoryComponent } from "./product-history/product-history.component";
import { BuyerDetailsComponent } from "./buyer-details/buyer-details.component";
import { MyCampaignComponent } from "./my-campaign/my-campaign.component";
import { ProductFlyersComponent } from "./product-flyers/product-flyers.component";
import { SellerNotificationComponent } from "./seller-notification/seller-notification.component";
import { ProfileCompletionComponent } from "./profile-completion/profile-completion.component";
import { UpdateUserDetailsComponent } from "./update-user-details/update-user-details.component";
import { ListSectionComponent } from "./list-section/list-section.component";
import { NotificationFlyerComponent } from "./notification-flyer/notification-flyer.component";
import { AlternativePaymentComponent } from "./alternative-payment/alternative-payment.component";

const routes: Routes = [
  {
    path: "",
    component: BaseComponent,
    canActivate: [BusinessAuthGuard],
    children: [
      {
        path: "home",
        component: DashboardWidgetComponent,
      },
      {
        path: "profile",
        component: UserProfileDetailsComponent,
      },
      {
        path: "cart-details",
        component: CartDetailsComponent,
      },
      {
        path: "subscriptions",
        component: SubscriptionListComponent,
      },
      {
        path: "quote",
        component: RfqComponent,
      },
      {
        path: "quote-details",
        component: QuoteDetailsComponent,
      },
      {
        path: "members-list",
        component: MembersListComponent,
      },
      {
        path: "create-group",
        component: CreateGroupComponent,
      },
      {
        path: "settings/:id",
        component: ListSectionComponent,
      },
      {
        path: "flyer/:id",
        component: NotificationFlyerComponent,
      },
      {
        path: "settings/:id/:query",
        component: ListSectionComponent,
      },
      {
        path: "sales",
        children: [
          {
            path: "",
            redirectTo: "catalogue",
            pathMatch: "full",
          },
          {
            path: "catalogue",
            component: SalesListComponent,
          },
          {
            path: "enquiry",
            component: SellerEnquiryComponent,
          },
          {
            path: "enquiry/:id",
            component: SellerEnquiryComponent,
          },
        ],
      },
      {
        path: "purchase",
        children: [
          {
            path: "catalogue",
            component: PurchaseListComponent,
          },
          {
            path: "enquiry",
            component: PurchaserEnquiryComponent,
          },
        ],
      },
      {
        path: "payment",
        children: [
          {
            path: "",
            redirectTo: "success",
            pathMatch: "full",
          },
          {
            path: "success",
            component: PaymentSuccessComponent,
          },
          {
            path: "error",
            component: PaymentErrorComponent,
          },
        ],
      },
      {
        path: "digital-markting",
        children: [
          {
            path: "digital-flyer",
            component: DigitalFlyerComponent,
          },
          {
            path: "my-campaign",
            component: MyCampaignComponent,
          },
        ],
      },
      {
        path: "error",
        component: ErrorComponent,
      },
      { path: "**", redirectTo: "error", pathMatch: "full" },
    ],
  },
];
@NgModule({
  imports: [
    AppPipesModule,
    SharedComponentModule,
    MatTooltipModule,
    CommonModule,
    NgxTagsInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    PartialsModule,
    MatPaginatorModule,
    CoreModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    NgbModule,
    FormsModule,
    MatTableModule,
    NgxTagsInputModule,
    MatTabsModule,
    NgxTinymceModule.forRoot({
      baseURL: "//cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.0/",
      // or cdn
    }),
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    PaymentjsModule,
    MatCheckboxModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DATA,
      useValue: {},
    },
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
  declarations: [
    DashboardComponent,
    UserProfileDetailsComponent,
    DashboardWidgetComponent,
    SubscriptionListComponent,
    SalesListComponent,
    PurchaseListComponent,
    BaseComponent,
    ErrorComponent,
    RfqComponent,
    CartDetailsComponent,
    SellerEnquiryComponent,
    PurchaserEnquiryComponent,
    QuoteDetailsComponent,
    PaymentSuccessComponent,
    PaymentErrorComponent,
    MembersListComponent,
    CreateGroupComponent,
    InvoiceComponent,
    DigitalFlyerComponent,
    TellBuyersComponent,
    ProductFlyersComponent,
    BuyerDetailsComponent,
    ProductHistoryComponent,
    MyCampaignComponent,
    SellerNotificationComponent,
    ProfileCompletionComponent,
    UpdateUserDetailsComponent,
    ListSectionComponent,
    NotificationFlyerComponent,
    AlternativePaymentComponent,
  ],
  entryComponents: [
    ProductHistoryComponent,
    InvoiceComponent,
    TellBuyersComponent,
    ProductFlyersComponent,
    BuyerDetailsComponent,
    MyCampaignComponent,
    SellerNotificationComponent,
    UpdateUserDetailsComponent,
    RfqComponent,
    AlternativePaymentComponent,
  ],
})
export class BusinessModule {}
