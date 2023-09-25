// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../../core/core.module';
import { PartialsModule } from '../../../partials/partials.module';
import { PartnerComponent } from './partner.component';
import { DashboardWidgetComponent } from './widget/widget.component'
import { BaseComponent } from './base/base.component'
import { SharedComponentModule } from '../../shared-component/shared-component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectNewsletterComponent } from './select-newsletter/select-newsletter.component';
import { ColorPickerModule } from 'ngx-color-picker';
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatAutocompleteModule,
	MatSnackBarModule,
	MatTooltipModule,

} from '@angular/material';
import { MemberComponent } from './member/member.component';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PartnerUserProfileComponent } from './partner-user-profile/partner-user-profile.component';
import { IndividualInviteComponent } from './individual-invite/individual-invite.component';
import { BulkEmailComponent } from './bulk-email/bulk-email.component';
import { InviteSettingsComponent } from './invite-settings/invite-settings.component';
import { NgxTinymceModule } from 'ngx-tinymce';
import { PendingRegistrationComponent } from './pending-registration/pending-registration.component';
import { ProfileUpdatedComponent } from './profile-updated/profile-updated.component';
import { PartnerAuthGuard } from './partner-auth-guard';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { PartnerLogoComponent } from './partner-logo/partner-logo.component';
import { AppPipesModule } from './../../../../app-pipes.modules';
import { PartnerImagesComponent } from './partner-images/partner-images.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { MyNewsletterComponent } from './my-newsletter/my-newsletter.component';
import { ListNewsletterComponent } from './list-newsletter/list-newsletter.component';
import { CreateNewsletterComponent } from './create-newsletter/create-newsletter.component';
import { SearchMemberComponent } from './search-member/search-member.component';
import { ListMangedGroupComponent } from './list-manged-group/list-manged-group.component';
import { CreateClusterGroupComponent } from './create-cluster-group/create-cluster-group.component';
import { ListManageGroupsComponent } from './list-manage-groups/list-manage-groups.component';

const routes: Routes = [
	{
		path: '',
		component: BaseComponent,
		canActivate: [PartnerAuthGuard],
		children: [
			{
				path: 'home',
				component: DashboardWidgetComponent,
			},
			{
				path: 'member',
				component: MemberComponent
			},
			{
				path: 'search-member',
				component: SearchMemberComponent
			},
			{
				path: 'profile',
				component: PartnerUserProfileComponent
			},
			{
				path: 'member-profile/:id',
				component: MemberProfileComponent
			},
			{
				path: 'partner-images',
				component: PartnerImagesComponent
			},
			{
				path: 'create-newsletter',
				component: CreateNewsletterComponent
			}, {
				path: 'list-newsletter',
				component: ListNewsletterComponent
			},

			{
				path: 'subscribers',
				component: SubscribersComponent
			},
			{
				path: 'my-newsletter',
				component: MyNewsletterComponent
			},
			{
				path: "create-cluster-group",
				component: CreateClusterGroupComponent
			},
			{
				path: "list-cluster-group",
				component: ListMangedGroupComponent
			},
			{
				path: "manage-groups/:id",
				component: ListManageGroupsComponent
			},
			{
				path: "manage-groups/:id/:query",
				component: ListManageGroupsComponent
			},
			{
				path: 'invite',
				children: [
					{
						path: 'individual-invite',
						component: IndividualInviteComponent
					},
					{
						path: 'bulk-invite',
						component: BulkEmailComponent
					},
					{
						path: 'invite-setting',
						component: InviteSettingsComponent
					},
					{
						path: 'pending-registration',
						component: PendingRegistrationComponent
					},
					{
						path: 'pending-registration/:id',
						component: PendingRegistrationComponent
					},
					{
						path: 'profile-updated',
						component: ProfileUpdatedComponent
					}
				]
			}
		]
	}
]

@NgModule({
	imports: [
		AppPipesModule,
		CommonModule,
		PartialsModule,
		CoreModule,
		RouterModule.forChild(routes),
		SharedComponentModule,
		MatInputModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
		MatSortModule,
		MatTableModule,
		MatSelectModule,
		MatMenuModule,
		MatProgressBarModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDialogModule,
		MatTabsModule,
		MatNativeDateModule,
		MatCardModule,
		MatRadioModule,
		MatIconModule,
		MatDatepickerModule,
		MatExpansionModule,
		MatAutocompleteModule,
		MatSnackBarModule,
		MatTooltipModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		ColorPickerModule,
		ToastrModule.forRoot({
			preventDuplicates: false,
		}),
		NgxTinymceModule.forRoot({
			baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.0/',
			// or cdn
		}),
	],
	providers: [],
	declarations: [
		PartnerComponent,
		DashboardWidgetComponent,
		BaseComponent,
		MemberComponent,
		PartnerUserProfileComponent,
		IndividualInviteComponent,
		BulkEmailComponent,
		InviteSettingsComponent,
		PendingRegistrationComponent,
		ProfileUpdatedComponent,
		MemberProfileComponent,
		PartnerLogoComponent,
		PartnerImagesComponent,
		SelectNewsletterComponent,
		SubscribersComponent,
		MyNewsletterComponent,
		ListNewsletterComponent,
		CreateNewsletterComponent,
		SearchMemberComponent,
		ListMangedGroupComponent,
		CreateClusterGroupComponent,
		ListManageGroupsComponent,
	],
	entryComponents: [PartnerLogoComponent, SelectNewsletterComponent]
})
export class PartnerModule {
}
