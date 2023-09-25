// Angular
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatIconModule,
	MatInputModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSnackBarModule,
	MatSortModule,
	MatTableModule,
	MatTabsModule,
	MatTooltipModule,
} from '@angular/material';
// NgBootstrap
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Core module
import { CoreModule } from '../../core/core.module';
// CRUD Partials
import {
	ActionNotificationComponent,
	AlertComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent,
} from './content/crud';
// Layout partials
import {
	ContextMenuComponent,
	ContextMenu2Component,
	ScrollTopComponent,
	SearchDefaultComponent,
	SearchDropdownComponent,
	SearchResultComponent,
	SplashScreenComponent,
	UserProfileComponent,
} from './layout';
// General
import { NoticeComponent } from './content/general/notice/notice.component';
import { PortletModule } from './content/general/portlet/portlet.module';
// Errpr
import { ErrorComponent } from './content/general/error/error.component';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
import { CartComponent } from './layout/topbar/cart/cart.component';
import { AuthModule } from '../pages/auth/auth.module';
import { ActionDialogComponent } from './content/crud/action-dialog/action-dialog.component';
import { AppPipesModule } from './../../app-pipes.modules';
import { NotificationComponent } from './layout/topbar/notification/notification.component';

@NgModule({
	declarations: [
		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		ActionDialogComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,

		// topbar components
		ContextMenuComponent,
		ContextMenu2Component,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		UserProfileComponent,
		CartComponent,
		ErrorComponent,
		ActionDialogComponent,
		NotificationComponent,
	],
	exports: [
		PortletModule,
		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		ActionDialogComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,

		// topbar components
		ContextMenuComponent,
		ContextMenu2Component,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		UserProfileComponent,
		CartComponent,
		NotificationComponent,
		ErrorComponent,
	],
	imports: [
		CommonModule,
		AppPipesModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		PerfectScrollbarModule,
		InlineSVGModule,
		CoreModule,
		PortletModule,
		AuthModule,
		// LoginPageModule,
		// angular material modules
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule,

		// ng-bootstrap modules
		NgbDropdownModule,
		NgbTabsetModule,
		NgbTooltipModule,
	],
})
export class PartialsModule {
}
