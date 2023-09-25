// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// Components
import { DefaultComponent } from "./views/theme/default/default.component";
import { BaseComponent } from "./views/theme/base/base.component";
import { ErrorPageComponent } from "./views/theme/content/error-page/error-page.component";
import { AuthGuard } from "./core/auth";
import { UnsubscribeComponent } from "./views/theme/unsubscribe-ns/unsubscribe-ns.component";
import { UnsubscribeMemberComponent } from "./views/theme/unsubscribe-member/unsubscribe-member.component";
const routes: Routes = [
  { path: "", redirectTo: "main/pages/home", pathMatch: "full" },
  { path: "", redirectTo: "m/pages/home", pathMatch: "full" },
  {
    path: "unsubscribe-ns",
    component: UnsubscribeComponent,
  },
  {
    path: "unsubscribe-invite",
    component: UnsubscribeMemberComponent,
  },
  {
    path: ":tenant",
    component: DefaultComponent,
    children: [
      {
        path: "",
        redirectTo: "pages/home",
        pathMatch: "full",
      },
      {
        path: "pages",
        component: BaseComponent,
        loadChildren: () =>
          import("../app/views/pages/home/home.module").then(
            (m) => m.HomeModule
          ),
      },
      {
        path: "p",
        component: BaseComponent,
        loadChildren: () =>
          import("../app/views/pages/home/home.module").then(
            (m) => m.HomeModule
          ),
      },
      {
        path: "registration",
        redirectTo: "auth/register",
        pathMatch: "full",
      },
      {
        path: "auth",
        loadChildren: () =>
          import("../app/views/pages/auth/auth.module").then(
            (m) => m.AuthModule
          ),
      },
      {
        path: "G/:groupname/:groupId/auth",
        loadChildren: () =>
          import("../app/views/pages/auth/auth.module").then(
            (m) => m.AuthModule
          ),
      },
      {
        path: "dashboard",
        component: BaseComponent,
        loadChildren: () =>
          import("../app/views/pages/dashboard/dashboard-routing.module").then(
            (m) => m.DashboardRoutingModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "minisite",
        component: BaseComponent,
        loadChildren: () =>
          import("../app/views/pages/minisite/minisite.module").then(
            (m) => m.MinisiteModule
          ),
      },
      {
        path: "m",
        component: BaseComponent,
        loadChildren: () =>
          import("../app/views/pages/minisite/minisite.module").then(
            (m) => m.MinisiteModule
          ),
      },
      {
        path: "error/403",
        component: ErrorPageComponent,
        data: {
          type: "error-v6",
          code: 403,
          title: "403... Access forbidden",
          desc:
            "Looks like you don't have permission to access for requested page.<br> Please, contact administrator",
        },
      },

      { path: "**", redirectTo: "home", pathMatch: "full" },
    ],
  },
  { path: "**", redirectTo: "error/403", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
