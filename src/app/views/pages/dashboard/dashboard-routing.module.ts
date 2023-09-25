import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'business',
    loadChildren: () =>
      import('app/views/pages/dashboard/business/business.module').then(
        m => m.BusinessModule,
      ),
  },
  {
    path: 'partner',
    loadChildren: () =>
      import('app/views/pages/dashboard/partner/partner.module').then(
        m => m.PartnerModule,
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('app/views/pages/dashboard/superadmin/superadmin.module').then(
        m => m.SuperadminModule,
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DashboardRoutingModule { }
