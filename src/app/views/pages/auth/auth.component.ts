import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { LayoutConfigService, SplashScreenService, TranslationService } from '../../../core/_base/layout';
import { AuthNoticeService } from '../../../core/auth';
import { PartnerService} from "../../../../provider/partner/partner.service";
import {environment} from '../../../../environments/environment'

@Component({
	selector: 'kt-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
	today: number = Date.now();
	headerLogo: string;
	public currentPartner: any;

	constructor(
			private el: ElementRef,
			private render: Renderer2,
			private layoutConfigService: LayoutConfigService,
			public authNoticeService: AuthNoticeService,
			private translationService: TranslationService,
			private splashScreenService: SplashScreenService,
			private partnerService: PartnerService
		) {
	}

	ngOnInit(): void {
		this.currentPartner = this.partnerService.getCurrentPartner();
		this.translationService.setLanguage(this.translationService.getSelectedLanguage());
		this.headerLogo = this.layoutConfigService.getLogo();

		this.splashScreenService.hide();
	}

	/**
	 * Load CSS for this specific page only, and destroy when navigate away
	 * @param styleUrl
	 */
	private loadCSS(styleUrl: string) {
		return new Promise((resolve, reject) => {
			const styleElement = document.createElement('link');
			styleElement.href = styleUrl;
			styleElement.type = 'text/css';
			styleElement.rel = 'stylesheet';
			styleElement.onload = resolve;
			this.render.appendChild(this.el.nativeElement, styleElement);
		});
	}
	openURL(){
		debugger
	let url=window.location.href.split("/")[3]
	if(url=='main'){
		window.location.href=environment.SEO_URL
	}
	else{
		window.location.href=environment.SEO_URL+"/"+url+'/pages/home'
	}

	}

}
