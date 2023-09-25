import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedComponentModule } from "../../shared-component/shared-component.module";
import { BaseComponent } from "./base/base.component";

import { RouterModule, Routes } from "@angular/router";
import { SuperAdminComponent } from "../../../pages/dashboard/superadmin/super-admin.component";
import { MatTabsModule } from "@angular/material";
import {
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatSelectModule,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material";
import {
  MomentDateModule,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { MatProgressSpinnerModule, MatIconModule } from "@angular/material";
import { MatDialogModule } from "@angular/material/dialog";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { PartialsModule } from "../../../partials/partials.module";
import { PaymentSettingsComponent } from "./payment-settings/payment-settings.component";
import { AddNewPackageComponent } from "./addnewpackage/addnewpackage.component";
import { SuperAdminAuthGuard } from "./superadmin-auth-guard";
import { AppPipesModule } from "./../../../../app-pipes.modules";
import { DashboardWidgetComponent } from "./widget/widget.component";
import { SelectNewsletterComponent } from "./select-newsletter/select-newsletter.component";
import { SubscribersComponent } from "./subscribers/subscribers.component";
import { CreateNewsletterComponent } from "./create-newsletter/create-newsletter.component";
import { NgxTinymceModule } from "ngx-tinymce";
import { MyNewsletterComponent } from "./my-newsletter/my-newsletter.component";
import { ListNewsletterComponent } from "./list-newsletter/list-newsletter.component";
import { TransactionHistoryComponent } from "./transaction-history/transaction-history.component";
import { HelperDialogComponent } from "./helper-dialog/helper-dialog.component";
import { CartDetailsInfoComponent } from "./cart-details-info/cart-details-info.component";
import { PaymentStatusComponent } from "./payment-status/payment-status.component";
import { UnspscCodesListComponent } from "./unspsc-codes-list/unspsc-codes-list.component";
import { HsnListComponent } from "./hsn-list/hsn-list.component";
import { ProductCategoryListComponent } from "./product-category-list/product-category-list.component";
import { TaxonomyDataListComponent } from "./taxonomy-data-list/taxonomy-data-list.component";
import { SharedDataTableComponent } from "./shared-data-table/shared-data-table.component";
import { MatProgressBarModule, MatCheckboxModule } from "@angular/material";
import { CustomBusinessListComponent } from "./custom-business-list/custom-business-list.component";
import { ExistingBusinessListComponent } from "./existing-business-list/existing-business-list.component";
import { CustomProductCategoryListComponent } from "./custom-product-category-list/custom-product-category-list.component";
import { PartnerMemberComponent } from "./partner-member/partner-member.component";
import { NewUploadComponent } from "./new-upload/new-upload.component";
import { ContentValidationComponent } from "./content-validation/content-validation.component";
import { PartnerMemberSuperAdminComponent } from "./partner-member-super-admin/partner-member-super-admin.component";
import { ListingRfqComponent } from "./listing-rfq/listing-rfq.component";
import { CreateRfqComponent } from "./create-rfq/create-rfq.component";
import { VerfifyDocumentComponent } from './verfify-document/verfify-document.component';
import { UploadedDocumentsComponent } from './uploaded-documents/uploaded-documents.component';
import { AnnoucementListComponent } from './annoucement-list/annoucement-list.component';
import { AddAnnoucementComponent } from './add-annoucement/add-annoucement.component';
import { UpdateDiscriptionComponent } from './update-discription/update-discription.component';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { UpdateDiscountComponent } from './update-discount/update-discount.component';

export const MY_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY",
  },
};

const routes: Routes = [
  {
    path: "",
    component: BaseComponent,
    canActivate: [SuperAdminAuthGuard],
    children: [
      {
        path: "home",
        component: DashboardWidgetComponent,
      },
      {
        path: "approvals",
        component: SuperAdminComponent,
      },
      {
        path: "settings",
        component: PaymentSettingsComponent,
      },
      {
        path: "create-newsletter",
        component: CreateNewsletterComponent,
      },
      {
        path: "list-newsletter",
        component: ListNewsletterComponent,
      },
      {
        path: "subscribers",
        component: SubscribersComponent,
      },
      {
        path: "my-newsletter",
        component: MyNewsletterComponent,
      },
      {
        path: "member",
        component: PartnerMemberSuperAdminComponent,
      },
      {
        path: "transaction",
        component: TransactionHistoryComponent,
      },
      {
        path: "payment-status",
        component: PaymentStatusComponent,
      },
      {
        path: "product-category",
        component: ProductCategoryListComponent,
      },
      {
        path: "taxonomy-unspsc-list",
        component: TaxonomyDataListComponent,
      },
      {
        path: "custom-business-category",
        component: CustomBusinessListComponent,
      },
      {
        path: "system-business-category",
        component: ExistingBusinessListComponent,
      },
      {
        path: "custom-product-category",
        component: CustomProductCategoryListComponent,
      },
      {
        path: "partner-member",
        component: PartnerMemberComponent,
      },
      {
        path: "new-upload",
        component: NewUploadComponent,
      },
      {
        path: "content-validation",
        component: ContentValidationComponent,
      },
      {
        path: "rfq-listing",
        component: ListingRfqComponent,
      },
      {
        path: "create-rfq",
        component: CreateRfqComponent,
      },
      {
        path: "documents-verify",
        component: VerfifyDocumentComponent,
      },
      {
        path:'annoucement-list',
        component:AnnoucementListComponent
      },
      {
        path:'add-annoucement',
        component:AddAnnoucementComponent
      },
      {
        path:'add-annoucement/:id',
        component:AddAnnoucementComponent
      },
      {
        path:'discount-list',
        component:AddDiscountComponent
      }
    ],
  },
];

@NgModule({
  imports: [
    AppPipesModule,
    CommonModule,
    SharedComponentModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    PartialsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    NgxTinymceModule,
    MatDatepickerModule,
    MatInputModule,
    MatSortModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  declarations: [
    SuperAdminComponent,
    PaymentSettingsComponent,
    AddNewPackageComponent,
    BaseComponent,
    DashboardWidgetComponent,
    SelectNewsletterComponent,
    SubscribersComponent,
    CreateNewsletterComponent,
    MyNewsletterComponent,
    ListNewsletterComponent,
    TransactionHistoryComponent,
    HelperDialogComponent,
    CartDetailsInfoComponent,
    PaymentStatusComponent,
    UnspscCodesListComponent,
    HsnListComponent,
    ProductCategoryListComponent,
    TaxonomyDataListComponent,
    SharedDataTableComponent,
    CustomBusinessListComponent,
    ExistingBusinessListComponent,
    CustomProductCategoryListComponent,
    PartnerMemberComponent,
    NewUploadComponent,
    ContentValidationComponent,
    PartnerMemberSuperAdminComponent,
    ListingRfqComponent,
    CreateRfqComponent,
    VerfifyDocumentComponent,
    UploadedDocumentsComponent,
    AnnoucementListComponent,
    AddAnnoucementComponent,
    UpdateDiscriptionComponent,
    AddDiscountComponent,
    UpdateDiscountComponent,
  ],
  entryComponents: [
    AddNewPackageComponent,
    SelectNewsletterComponent,
    HelperDialogComponent,
    CartDetailsInfoComponent,
    SharedDataTableComponent,
    HsnListComponent,
    UnspscCodesListComponent,
    ProductCategoryListComponent,
    UploadedDocumentsComponent,
    UpdateDiscriptionComponent,
    UpdateDiscountComponent
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SuperadminModule {}
