// Anglar
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseUrlPipe } from './core/_base/layout/pipes/base-url';
import { ProductLookupComponent } from './components/product-lookup/product-lookup.component';
import { HsnLookupComponent } from './components/hsn-lookup/hsn-lookup.component';
import { CategoryLookupComponent } from './components/category-lookup/category-lookup.component';
import { BusinessCategoryLookupComponent } from './components/business-category-lookup/business-category-lookup.component';
import { OranizationLookupsComponent } from './components/oranization-lookups/oranization-lookups.component';
import { HsnMultiSelectComponent } from './components/hsn-multi-select-lookups/hsn-multi-select.component';
import { LocationLookupsComponent } from './components/location-lookups/location-lookups.component';

@NgModule({
	imports: [CommonModule],
	declarations: [
		BaseUrlPipe,
		ProductLookupComponent,
		HsnLookupComponent,
		CategoryLookupComponent,
		BusinessCategoryLookupComponent,
		OranizationLookupsComponent,
		HsnMultiSelectComponent,
		LocationLookupsComponent
	],
	exports: [
		BaseUrlPipe,
		ProductLookupComponent,
		HsnLookupComponent,
		CategoryLookupComponent,
		BusinessCategoryLookupComponent,
		OranizationLookupsComponent,
		HsnMultiSelectComponent,
		LocationLookupsComponent
	],
	entryComponents: [
		ProductLookupComponent,
		HsnLookupComponent,
		CategoryLookupComponent,
		BusinessCategoryLookupComponent,
		OranizationLookupsComponent,
		HsnMultiSelectComponent,
		LocationLookupsComponent
	],
	providers: [BaseUrlPipe]
})

export class AppPipesModule { }
