import { Component, OnInit } from '@angular/core';
@Component({
	selector: 'kt-partner',
	templateUrl: './partner.component.html',
	styleUrls: ['partner.component.scss'],
})
export class PartnerComponent implements OnInit {
	contact: any;

	constructor() {}

	ngOnInit(): void {
		this.getContactDetails();
	}

	//get contact details from localstorage
	getContactDetails() {
		let user: any = JSON.parse(localStorage.getItem('memberData'));
		if (user) {
			this.contact = user.memberUserInfo;
			this.contact.shortName = (this.contact.name[ 0 ] + this.contact.name[ 1 ]).toUpperCase();
		}
	}

}
