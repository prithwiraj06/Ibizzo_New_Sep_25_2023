// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessModule } from './business/business.module';
import { PartnerModule } from './partner/partner.module';
import { SuperadminModule } from './superadmin/superadmin.module'
import { AppPipesModule } from '../../../app-pipes.modules';

@NgModule({
	imports: [
		CommonModule,
		BusinessModule,
		PartnerModule,
		SuperadminModule,
		AppPipesModule
	],
	providers: [],
	declarations: [],
})
export class DashboardModule {
}