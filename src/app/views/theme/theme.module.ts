import { NgxPermissionsModule } from "ngx-permissions";
// Angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ClipboardModule } from "ngx-clipboard";

// Angular Material
import {
  MatButtonModule,
  MatProgressBarModule,
  MatTabsModule,
  MatTooltipModule,
  MatIconModule,
} from "@angular/material";
// NgBootstrap
import {
  NgbProgressbarModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
// Translation
import { TranslateModule } from "@ngx-translate/core";
// Loading bar
import { LoadingBarModule } from "@ngx-loading-bar/core";
// NGRX
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
// Ngx DatePicker
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
// Perfect Scrollbar
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
// SVG inline
import { InlineSVGModule } from "ng-inline-svg";
// Core Module
import { CoreModule } from "../../core/core.module";
import { HeaderComponent } from "./header/header.component";
import { AsideLeftComponent } from "./aside/aside-left.component";
import { FooterComponent } from "./footer/footer.component";
import { BrandComponent } from "./brand/brand.component";
import { TopbarComponent } from "./header/topbar/topbar.component";
import { MenuHorizontalComponent } from "./header/menu-horizontal/menu-horizontal.component";
import { PartialsModule } from "../partials/partials.module";
import { BaseComponent } from "./base/base.component";
import { PagesModule } from "../pages/pages.module";
import { HtmlClassService } from "./html-class.service";
import { HeaderMobileComponent } from "./header/header-mobile/header-mobile.component";
import { ErrorPageComponent } from "./content/error-page/error-page.component";
import {
  PermissionEffects,
  permissionsReducer,
  RoleEffects,
  rolesReducer,
} from "../../core/auth";
import { SharedComponentModule } from "../../../app/views/pages/shared-component/shared-component.module";
import { MinisiteHeaderComponent } from "./header/minisite-header/minisite-header/minisite-header.component";
import { DefaultComponent } from "./default/default.component";
import { AppPipesModule } from "./../../app-pipes.modules";
import { UnsubscribeComponent } from "./unsubscribe-ns/unsubscribe-ns.component";
import { UnsubscribeMemberComponent } from "./unsubscribe-member/unsubscribe-member.component";
import { ListDocumentsComponent } from './list-documents/list-documents.component';
@NgModule({
  declarations: [
    BaseComponent,
    FooterComponent,

    // headers
    HeaderComponent,
    BrandComponent,
    HeaderMobileComponent,

    // topbar components
    TopbarComponent,

    // aside left menu components
    AsideLeftComponent,

    // horizontal menu components
    MenuHorizontalComponent,

    ErrorPageComponent,
    MinisiteHeaderComponent,
    DefaultComponent,
    UnsubscribeComponent,
    UnsubscribeMemberComponent,
    ListDocumentsComponent,
  ],
  exports: [
    BaseComponent,
    FooterComponent,
    DefaultComponent,

    // headers
    HeaderComponent,
    BrandComponent,
    HeaderMobileComponent,

    // topbar components
    TopbarComponent,

    // aside left menu components
    AsideLeftComponent,

    // horizontal menu components
    MenuHorizontalComponent,

    ErrorPageComponent,
    UnsubscribeComponent,
    UnsubscribeMemberComponent,
  ],
  providers: [HtmlClassService],
  imports: [
    AppPipesModule,
    CommonModule,
    RouterModule,
    ClipboardModule,
    NgxPermissionsModule.forChild(),
    StoreModule.forFeature("roles", rolesReducer),
    StoreModule.forFeature("permissions", permissionsReducer),
    EffectsModule.forFeature([PermissionEffects, RoleEffects]),
    PagesModule,
    PartialsModule,
    CoreModule,
    PerfectScrollbarModule,
    FormsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule.forChild(),
    LoadingBarModule,
    NgxDaterangepickerMd,
    InlineSVGModule,
    MatIconModule,
    // ng-bootstrap modules
    NgbProgressbarModule,
    NgbTooltipModule,
    SharedComponentModule,
  ],
  entryComponents: [
    ListDocumentsComponent
  ]
})
export class ThemeModule {}
