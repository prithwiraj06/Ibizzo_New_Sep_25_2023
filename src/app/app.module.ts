// Angular
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  GestureConfig,
  MatProgressSpinnerModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material";
import { OverlayModule } from "@angular/cdk/overlay";
// Angular in memory
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
// Perfect Scroll bar
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
// SVG inline
import { InlineSVGModule } from "ng-inline-svg";
// Env
import { environment } from "../environments/environment";
// Hammer JS
import "hammerjs";
// NGX Permissions
import { NgxPermissionsModule } from "ngx-permissions";
// NGRX
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
// State
import { metaReducers, reducers } from "./core/reducers";
// Copmponents
import { AppComponent } from "./app.component";
// Modules
import { AppRoutingModule } from "./app-routing.module";
import { AppPipesModule } from "./app-pipes.modules";

import { CoreModule } from "./core/core.module";
import { ThemeModule } from "./views/theme/theme.module";
// Partials
import { PartialsModule } from "./views/partials/partials.module";
// import { PaymentjsService } from 'paymentjs';

// import { RazorpayService } from '../../node_modules/paymentjs/vendor/razorpay';
// import { PayPalService } from '../../node_modules/paymentjs/vendor/paypal';
import { ToastrModule } from "ngx-toastr";
// Layout Services
import {
  DataTableService,
  FakeApiService,
  KtDialogService,
  LayoutConfigService,
  LayoutRefService,
  MenuAsideService,
  MenuConfigService,
  MenuHorizontalService,
  PageConfigService,
  SplashScreenService,
  SubheaderService,
} from "./core/_base/layout";

// Auth
import { AuthModule } from "./views/pages/auth/auth.module";
import { AuthService } from "./core/auth";
import { PartnerService } from "../provider/partner/partner.service";

// CRUD
import {
  HttpUtilsService,
  LayoutUtilsService,
  TypesUtilsService,
} from "./core/_base/crud";
// Config
import { LayoutConfig } from "./core/_config/layout.config";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// Highlight JS
import { HIGHLIGHT_OPTIONS, HighlightLanguage } from "ngx-highlightjs";
import * as typescript from "highlight.js/lib/languages/typescript";
import * as scss from "highlight.js/lib/languages/scss";
import * as xml from "highlight.js/lib/languages/xml";
import * as json from "highlight.js/lib/languages/json";

// token interceptor
import { TokenInterceptorService } from "./token-interceptor/token-interceptor.service";

// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelSpeed: 0.5,
  swipeEasing: true,
  minScrollbarLength: 40,
  maxScrollbarLength: 300,
};

export function initializeLayoutConfig(
  appConfig: LayoutConfigService,
  partnerService: PartnerService
) {
  return () => {
    return new Promise((resolve, reject) => {
      if (!partnerService) {
        reject();
        return false;
      }
      partnerService.init().then(
        () => {
          let result = partnerService.getCurrentPartner();
          document.title =
            result.id == 1 ? "iBizzo | Unified Marketplace" : result.name;
          if (appConfig.getConfig() === null) {
            appConfig.loadConfigs(new LayoutConfig().configs);
          }
          resolve();
        },
        (err: any) => {
          resolve();
        }
      );
    });
  };
}

export function hljsLanguages(): HighlightLanguage[] {
  return [
    { name: "typescript", func: typescript },
    { name: "scss", func: scss },
    { name: "xml", func: xml },
    { name: "json", func: json },
  ];
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppPipesModule,
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeApiService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false,
        })
      : [],
    NgxPermissionsModule.forRoot(),
    PartialsModule,
    CoreModule,
    OverlayModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({ stateKey: "router" }),
    StoreDevtoolsModule.instrument(),
    AuthModule.forRoot(),
    TranslateModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
    }),
    MatProgressSpinnerModule,
    InlineSVGModule.forRoot(),
    ThemeModule,
  ],
  exports: [],
  providers: [
    AuthService,
    LayoutConfigService,
    LayoutRefService,
    MenuConfigService,
    PageConfigService,
    KtDialogService,
    DataTableService,
    SplashScreenService,
    // PaymentjsService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: GestureConfig,
    },
    {
      // layout config initializer
      provide: APP_INITIALIZER,
      useFactory: initializeLayoutConfig,
      deps: [LayoutConfigService, PartnerService],
      multi: true,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: { languages: hljsLanguages },
    },
    // template services
    SubheaderService,
    MenuHorizontalService,
    MenuAsideService,
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {
        // hasBackdrop: true,
        disableClose: true,
      },
    },
    {
      provide: MatDialogRef,
      useValue: {
        // hasBackdrop: true,
        disableClose: true,
      },
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
