// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PartialsModule } from '../partials/partials.module';
import { CoreModule } from '../../core/core.module';
import { ECommerceModule } from './apps/e-commerce/e-commerce.module';

@NgModule({
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		ECommerceModule
	],
	providers: [],
	declarations: []
})
export class PagesModule {
}
