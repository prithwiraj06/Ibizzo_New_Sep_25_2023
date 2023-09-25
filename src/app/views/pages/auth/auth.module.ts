// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Material
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatIconModule, } from '@angular/material';
// Translate
import { MatDialogModule, MatDialogRef, MatProgressSpinnerModule } from '@angular/material'
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgxCaptchaModule } from 'ngx-captcha';
import { RecaptchaModule } from 'ng-recaptcha';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgxTagsInputModule } from 'ngx-tags-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppPipesModule } from './../../../app-pipes.modules';
// CRUD
import { InterceptService } from '../../../core/_base/crud/';
// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
// Auth
import { AuthEffects, AuthGuard, authReducer, AuthService } from '../../../core/auth';
import { EmailComponent } from './login-page/email/email.component';
import { PasswordComponent } from './login-page/password/password.component';
import { ForgotPasswordComponent } from './login-page/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './login-page/change-password/change-password.component';
import { RegisterPageComponent } from './login-page/register-page/register-page.component';
import { TermsConditionComponent } from './login-page/terms-condition/terms-condition.component';
import { TermsAndConditionsComponent } from './login-page/terms-and-conditions/terms-and-conditions.component'

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: 'register',
				component: RegisterComponent
			},
			{
				path: 'forgot-password',
				component: ForgotPasswordComponent,
			}
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		AppPipesModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		RouterModule.forChild(routes),
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		MatIconModule,
		MatDialogModule,
		TranslateModule.forChild(),
		NgxCaptchaModule,
		RecaptchaModule.forRoot(),
		StoreModule.forFeature('auth', authReducer),
		EffectsModule.forFeature([ AuthEffects ]),
		DeviceDetectorModule.forRoot(),
		// TagsInputModule.forRoot(),
		NgxTagsInputModule,
		NgbModule,
		MatProgressSpinnerModule
	],

	providers: [
		InterceptService,
		{ provide: MatDialogRef, useValue: {} },
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
	],

	entryComponents: [
		TermsAndConditionsComponent,
		EmailComponent,
		PasswordComponent,
		ForgotPasswordComponent,
		ChangePasswordComponent,
		RegisterPageComponent,
		RegisterComponent,
		TermsConditionComponent,
	],

	exports: [
		AuthComponent,
		RecaptchaModule,
	],

	declarations: [
		AuthComponent,
		LoginComponent,
		RegisterComponent,
		ForgotPasswordComponent,
		AuthNoticeComponent,
		EmailComponent,
		PasswordComponent,
		ChangePasswordComponent,
		RegisterPageComponent,
		TermsConditionComponent,
		TermsAndConditionsComponent,
	]
})

export class AuthModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AuthModule,
			providers: [
				AuthService,
				AuthGuard,
			]
		};
	}
}
