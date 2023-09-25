// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { MinisiteComponent } from './minisite.component';
import { MinisiteHomeComponent } from './home/home.component';
import { MatCardModule } from '@angular/material/card';
import { SalesCatalogueComponent } from './sales-catalogue/sales-catalogue.component';
import { SharedComponentModule } from '../shared-component/shared-component.module';
import { ProductImageGalleryComponent } from './product-image-gallery/product-image-gallery.component';
import { MatIconModule } from '@angular/material';
import { SvgBackgroundDirective } from './svg-background/svg-background.directive';
import { LeadsPromotesDeskComponent } from './leads-promotes-desk/leads-promotes-desk.component'
import {
	MatFormFieldModule,
	MatInputModule,
	MatSelectModule,
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatCardModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild([
			{
				path: 'home',
				component: MinisiteHomeComponent,
			}, {
				path: 'sales-catalogue',
				component: SalesCatalogueComponent
			},
			{
				path: 'h/:id',
				component: MinisiteHomeComponent,
			}, {
				path: 's/:id',
				component: SalesCatalogueComponent
			}

		]),
		SharedComponentModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [],
	declarations: [
		MinisiteComponent,
		MinisiteHomeComponent,
		SalesCatalogueComponent,
		ProductImageGalleryComponent,
		SvgBackgroundDirective,
		LeadsPromotesDeskComponent
	],
	entryComponents: [
		MinisiteHomeComponent,
		LeadsPromotesDeskComponent
	]
})
export class MinisiteModule {
}
