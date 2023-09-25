// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  MatProgressSpinnerModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material";

// Core Module
import { CoreModule } from "../../../core/core.module";
import { PartialsModule } from "../../partials/partials.module";
import { HomeComponent } from "./home/home.component";
import { SearchResultComponent } from "./search-result/search-result.component";
import { HomeRouteComponent } from "./home-route/home-route.component";
import { SupportComponent } from "./support/support.component";

import {
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CountUpModule } from "ngx-countup";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatTabsModule } from "@angular/material";
import { SharedComponentModule } from "../shared-component/shared-component.module";
import { AuthGuard } from "../../../core/auth";
import {
  MatTableModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatIconModule,
} from "@angular/material";
import { AppPipesModule } from "./../../../app-pipes.modules";
import { StatisticsComponent } from "./statistics/statistics.component";
import { MarketPlaceComponent } from "./market-place/market-place.component";
import { HeroBannerComponent } from "./hero-banner/hero-banner.component";
import { RfqComponent } from "./rfq/rfq.component";
import { SearchCategoryComponent } from "./search-category/search-category.component";
import { CategoriesComponent } from "./categories/categories.component";
import { PartnerImageGalleryComponent } from "./partner-image-gallery/partner-image-gallery.component";
import { PartnerMembersComponent } from "./partner-members/partner-members.component";
import { PublicGroupPageComponent } from "./public-group-page/public-group-page.component";
import { PublicNotificationPageComponent } from "./public-notification-page/public-notification-page.component";
import { TradePostsComponent } from "./trade-posts/trade-posts.component";
import { PackagesComponent } from "./packages/packages.component";
import { LeadsPromotesDeskComponent } from "./leads-promotes-desk/leads-promotes-desk.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { LogoutComponentComponent } from "./logout-component/logout-component.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "home/:id",
    component: HomeComponent,
  },
  {
    path: "home/:id/:enquiryId",
    component: HomeComponent,
  },
  {
    path: "search",
    component: SearchResultComponent,
  },
  {
    path: "s/:id",
    component: SearchResultComponent,
  },
  {
    path: "partner-members",
    component: PartnerMembersComponent,
  },
  {
    path: "request-for-quote",
    component: RfqComponent,
  },
  {
    path: "trade-posts",
    component: TradePostsComponent,
  },

  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent,
  },
  // {
  //   path: "group",
  //   component: PublicGroupPageComponent,
  // },
  {
    path: "g/:id",
    component: PublicGroupPageComponent,
  },
  {
    path: "n/:id",
    component: PublicNotificationPageComponent,
  },
  {
    path: "r/:id1/:id2",
    component: RfqComponent,
  },

  {
    path: "support",
    component: SupportComponent,
  },
  {
    path: "category",
    component: SearchCategoryComponent,
  },
  {
    path: "packages",
    component: PackagesComponent,
  },
  {
    path: "packages/:id",
    component: PackagesComponent,
  },
  {
    path: "logout",
    component: LogoutComponentComponent,
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("../dashboard/dashboard-routing.module").then(
        (m) => m.DashboardRoutingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "minisite",
    loadChildren: () =>
      import("../minisite/minisite.module").then((m) => m.MinisiteModule),
  },
];

@NgModule({
  imports: [
    AppPipesModule,
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    CountUpModule,
    NgbModule,
    MatTabsModule,
    SharedComponentModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatIconModule,
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
    HomeComponent,
    SearchResultComponent,
    HomeRouteComponent,
    RfqComponent,
    StatisticsComponent,
    MarketPlaceComponent,
    HeroBannerComponent,
    SupportComponent,
    SearchCategoryComponent,
    CategoriesComponent,
    PartnerImageGalleryComponent,
    PartnerMembersComponent,
    PublicGroupPageComponent,
    PublicGroupPageComponent,
    PublicNotificationPageComponent,
    TradePostsComponent,
    PackagesComponent,
    LeadsPromotesDeskComponent,
    PrivacyPolicyComponent,
    LogoutComponentComponent,
  ],
  entryComponents: [PartnerMembersComponent, LeadsPromotesDeskComponent],
})
export class HomeModule {}
