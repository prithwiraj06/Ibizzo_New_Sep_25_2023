// Angular
import { Component, Input } from '@angular/core';
import { AuthService } from '../../../../views/pages/auth/auth.service'
import { MinisiteService } from '../../../../../provider/minisite/minisite.service';

@Component({
	selector: 'kt-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
	isLoggedIn: boolean = false;
	isCheckMinisite: boolean = true;
	@Input() user:any
	constructor(
		private authService: AuthService,
		private service: MinisiteService
	) {
		this.isLoggedIn = (this.authService.getUserId() != null);
		service.onEvent("HEADER").subscribe(() => {
			console.log("TopBar");
			this.isCheckMinisite = false;
		})
	}

	ngOnInit() {
		console.log('user==========>',this.user);
		
	}

	checkForMinisite() {
		return window.location.href.includes('dashboard') ? true : window.location.href.includes('pages') ? true : this.checkUrl();
	}

	checkUrl() {
		let arr = window.location.href.split("/");
		let list = arr[arr.length - 1].split('-');
		list[list.length - 1].includes('p')
		return list[list.length - 1].includes('p');
	}

}
