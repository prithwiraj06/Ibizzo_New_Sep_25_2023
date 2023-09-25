import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { NewArrivalsComponent } from "./new-arrivals/new-arrivals.component";
import { SharedCardsComponent } from "./shared-products/shared-products.component";
import { NoResultsComponent } from "./no-results/no-results.component";
import { ProductListComponent } from "./product-list/product-list.component";
import {
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatGridListModule,
} from "@angular/material";
import { CountUpModule } from "ngx-countup";

import { PartialsModule } from "../../partials/partials.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { NgxTagsInputModule } from "ngx-tags-input";
import { UserProfileUpdateComponent } from "./user-profile-update/user-profile-update.component";
import { TagInputModule } from "ngx-chips";
import { NgxTinymceModule } from "ngx-tinymce";
import { ColorPickerModule } from "ngx-color-picker";
import { HyperlinkDirective } from "./hyperlink/hyperlink.directive";
import { CharnameDirective } from "./charname/charname.directive";
import { ActiveLinkDirective } from "./activelink/active-link.directive";
import { ProductCardComponent } from "./product-card/product-card.component";
import { SalesEditComponent } from "./sales/sales-edit/sales-edit.component";
import { PurchaseEditComponent } from "./purchase/purchase-edit/purchase-edit.component";
import { SalesListComponent } from "./sales/sales-list/sales-list.component";
import { PurchaseListComponent } from "./purchase/purchase-list/purchase-list.component";
import { MatTabsModule } from "@angular/material";
import { SvgBackgroundDirective } from "./svg-background/svg-background.directive";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgxPaginationModule } from "ngx-pagination";
import { ClipboardModule } from "ngx-clipboard";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { ReinviteMemberListComponent } from "./reinvite-member-list/reinvite-member-list.component";
import { MatButtonModule } from "@angular/material/button";
import { InviteSettingsComponent } from "./invite-settings/invite-settings.component";
import { AddCommentsComponent } from "../dashboard/partner/add-comments/add-comments.component";
import { SeeHistoryComponent } from "../dashboard/partner/see-history/see-history.component";
import { SwipeCardsComponent } from "./swipe-cards/swipe-cards.component";
import { ReInviteComponent } from "./re-invite/re-invite.component";
import { AppPipesModule } from "./../../../app-pipes.modules";
import { SellerNotificationComponent } from "./seller-notification/seller-notification.component";
import { NewsletterTemplateComponent } from "./newsletter-template/newsletter-template.component";
import { CompanyCardComponent } from "./company-card/company-card.component";
import { CodesListsComponent } from "./codes-lists/codes-lists.component";

import { SharedMyNewsletterComponent } from "./my-newsletter/my-newsletter.component";
import { SharedListNewsletterComponent } from "./list-newsletter/list-newsletter.component";
import { MyNewsletterViewComponent } from "./my-newsletter-view/my-newsletter-view.component";
import { RfqWithoutIdComponent } from "./rfq-without-id/rfq-without-id.component";
import { UserCartDetailsComponent } from "./user-cart-details/user-cart-details.component";
import { PaymentjsModule } from "paymentjs";
import { SimilarSupplierComponent } from "./similar-supplier/similar-supplier.component";
import { HsnListItemComponent } from "./hsn-list-item/hsn-list-item.component";
import { SharedVerifyModelComponent } from "./shared-verify-model/shared-verify-model.component";
import { MasterCardsComponent } from "./master-cards/master-cards.component";
import { CreateGroupClusterComponent } from "./create-group-cluster/create-group-cluster.component";
import { PartnerMemberComponent } from "./partner-member/partner-member.component";
import { ArticleCardComponent } from "./article-card/article-card.component";
import { CommentBoxComponent } from "./comment-box/comment-box.component";
import { ViewImageComponent } from "./view-image/view-image.component";
import { ProductCatagoryTableComponent } from "./product-catagory-table/product-catagory-table.component";
import { SystemBusinessCategoryListComponent } from "./system-business-category-list/system-business-category-list.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { GroupCardsComponent } from "./group-cards/group-cards.component";
import { SettingsComponent } from "./settings/settings.component";
import { GroupMembersComponent } from "./group-members/group-members.component";
import { CreateArticlePostComponent } from "./create-article-post/create-article-post.component";
import { PartnerMemberListComponent } from "./partner-member-list/partner-member-list.component";
import { VideoPostComponent } from "./video-post/video-post.component";
import { DataSourceTableComponent } from "./data-source-table/data-source-table.component";
import { AssignRoleInGroupComponent } from "./assign-role-in-group/assign-role-in-group.component";
import { GroupMainPageComponent } from "./group-main-page/group-main-page.component";
import { InviteMemberComponent } from "./invite-member/invite-member.component";
import { GroupMemberDataSourceComponent } from "./group-member-data-source/group-member-data-source.component";
import { MemberDetailsComponent } from "./member-details/member-details.component";
import { PartnerProductsComponent } from "./partner-products/partner-products.component";
import { UnsubscribeComponent } from "./unsubscribe/unsubscribe.component";
import { SocialShareComponent } from "./social-share/social-share.component";
import { TradePostsComponent } from "./trade-posts/trade-posts.component";
import { SubscribePackagesComponent } from "./subscribe-packages/subscribe-packages.component";
import { PurchseHistoryComponent } from "./purchse-history/purchse-history.component";
import { AdvisorDetailsComponent } from "./advisor-details/advisor-details.component";
import { ContactPackageComponent } from "./contact-package/contact-package.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { DigitalFlyerComponent } from "./digital-flyer/digital-flyer.component";
import { AnnoucementListComponent } from './annoucement-list/annoucement-list.component';
import { AddAnnoucementComponent } from './add-annoucement/add-annoucement.component';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { DynamicObjectValueComponent } from './dynamic-object-value/dynamic-object-value.component';
// import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './image-cropper/component/image-cropper.component';
import {NgxImageCompressService} from 'ngx-image-compress';

@NgModule({
  declarations: [
    SharedCardsComponent,
    NoResultsComponent,
    HyperlinkDirective,
    CharnameDirective,
    UserProfileUpdateComponent,
    ProductListComponent,
    ActiveLinkDirective,
    ProductCardComponent,
    SalesEditComponent,
    PurchaseEditComponent,
    SalesListComponent,
    PurchaseListComponent,
    NewArrivalsComponent,
    SvgBackgroundDirective,
    InviteSettingsComponent,
    ReinviteMemberListComponent,
    CodesListsComponent,
    AddCommentsComponent,
    SeeHistoryComponent,
    SwipeCardsComponent,
    ReInviteComponent,
    SellerNotificationComponent,
    NewsletterTemplateComponent,
    CompanyCardComponent,
    SharedMyNewsletterComponent,
    SharedListNewsletterComponent,
    MyNewsletterViewComponent,
    RfqWithoutIdComponent,
    UserCartDetailsComponent,
    SimilarSupplierComponent,
    HsnListItemComponent,
    SharedVerifyModelComponent,
    ArticleCardComponent,
    CommentBoxComponent,
    MasterCardsComponent,
    CreateGroupClusterComponent,
    PartnerMemberComponent,
    ViewImageComponent,
    ProductCatagoryTableComponent,
    SystemBusinessCategoryListComponent,
    GroupCardsComponent,
    SettingsComponent,
    GroupMembersComponent,
    CreateArticlePostComponent,
    PartnerMemberListComponent,
    DataSourceTableComponent,
    AssignRoleInGroupComponent,
    VideoPostComponent,
    GroupMainPageComponent,
    InviteMemberComponent,
    GroupMemberDataSourceComponent,
    MemberDetailsComponent,
    PartnerProductsComponent,
    UnsubscribeComponent,
    SocialShareComponent,
    TradePostsComponent,
    SubscribePackagesComponent,
    PurchseHistoryComponent,
    AdvisorDetailsComponent,
    ContactPackageComponent,
    ContactUsComponent,
    DigitalFlyerComponent,
    AnnoucementListComponent,
    AddAnnoucementComponent,
    PhotoEditorComponent,
    DynamicObjectValueComponent,
    ImageCropperComponent
  ],
  exports: [
    SharedCardsComponent,
    NoResultsComponent,
    HyperlinkDirective,
    CharnameDirective,
    UserProfileUpdateComponent,
    ProductListComponent,
    ActiveLinkDirective,
    ProductCardComponent,
    SalesEditComponent,
    PurchaseEditComponent,
    SalesListComponent,
    PurchaseListComponent,
    NewArrivalsComponent,
    ReinviteMemberListComponent,
    CodesListsComponent,
    InviteSettingsComponent,
    SwipeCardsComponent,
    ReInviteComponent,
    SellerNotificationComponent,
    NewsletterTemplateComponent,
    CompanyCardComponent,
    SharedMyNewsletterComponent,
    SharedListNewsletterComponent,
    MyNewsletterViewComponent,
    RfqWithoutIdComponent,
    UserCartDetailsComponent,
    SimilarSupplierComponent,
    HsnListItemComponent,
    SharedVerifyModelComponent,
    ArticleCardComponent,
    CommentBoxComponent,
    MasterCardsComponent,
    CreateGroupClusterComponent,
    PartnerMemberComponent,
    ViewImageComponent,
    ProductCatagoryTableComponent,
    SystemBusinessCategoryListComponent,
    SettingsComponent,
    GroupMembersComponent,
    CreateArticlePostComponent,
    GroupCardsComponent,
    VideoPostComponent,
    DataSourceTableComponent,
    PartnerMemberListComponent,
    AssignRoleInGroupComponent,
    GroupMainPageComponent,
    InviteMemberComponent,
    GroupMemberDataSourceComponent,
    MemberDetailsComponent,
    PartnerProductsComponent,
    UnsubscribeComponent,
    SocialShareComponent,
    TradePostsComponent,
    SubscribePackagesComponent,
    AdvisorDetailsComponent,
    ContactPackageComponent,
    ContactUsComponent,
    DigitalFlyerComponent,
    AnnoucementListComponent,
    AddAnnoucementComponent,
    DynamicObjectValueComponent,
    PhotoEditorComponent,
    ImageCropperComponent
  ],
  entryComponents: [
    SharedCardsComponent,
    NoResultsComponent,
    UserProfileUpdateComponent,
    ProductListComponent,
    SalesEditComponent,
    ProductListComponent,
    ProductCardComponent,
    PurchaseEditComponent,
    SalesListComponent,
    PurchaseListComponent,
    NewArrivalsComponent,
    InviteSettingsComponent,
    ReinviteMemberListComponent,
    InviteSettingsComponent,
    AddCommentsComponent,
    SeeHistoryComponent,
    SwipeCardsComponent,
    ReInviteComponent,
    CodesListsComponent,
    SellerNotificationComponent,
    NewsletterTemplateComponent,
    CompanyCardComponent,
    SharedMyNewsletterComponent,
    SharedListNewsletterComponent,
    MyNewsletterViewComponent,
    RfqWithoutIdComponent,
    UserCartDetailsComponent,
    SimilarSupplierComponent,
    HsnListItemComponent,
    SharedVerifyModelComponent,
    ArticleCardComponent,
    CommentBoxComponent,
    MasterCardsComponent,
    CreateGroupClusterComponent,
    PartnerMemberComponent,
    ViewImageComponent,
    ProductCatagoryTableComponent,
    SystemBusinessCategoryListComponent,
    SettingsComponent,
    GroupMembersComponent,
    CreateArticlePostComponent,
    GroupCardsComponent,
    VideoPostComponent,
    DataSourceTableComponent,
    PartnerMemberListComponent,
    AssignRoleInGroupComponent,
    GroupMainPageComponent,
    InviteMemberComponent,
    GroupMemberDataSourceComponent,
    MemberDetailsComponent,
    PartnerProductsComponent,
    UnsubscribeComponent,
    SocialShareComponent,
    TradePostsComponent,
    SubscribePackagesComponent,
    PurchseHistoryComponent,
    AdvisorDetailsComponent,
    ContactPackageComponent,
    ContactUsComponent,
    DigitalFlyerComponent,
    AnnoucementListComponent,
    AddAnnoucementComponent,
    DynamicObjectValueComponent,
    PhotoEditorComponent,
  ],
  imports: [
    AppPipesModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    CommonModule,
    NgbModule,
    MatSortModule,
    RouterModule.forChild([]),
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSelectModule,
    MatProgressBarModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    ClipboardModule,
    NgxTagsInputModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    TagInputModule,
    MatTabsModule,
    PaymentjsModule,
    CountUpModule,
    NgxPaginationModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    NgxTinymceModule.forRoot({
      baseURL: "//cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.0/",
      // or cdn
    }),
    ColorPickerModule,
    // ImageCropperModule
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    NgxImageCompressService
    // ...
  ],
})
export class SharedComponentModule {}
