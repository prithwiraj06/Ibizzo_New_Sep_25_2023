import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-partner-user-profile',
  templateUrl: './partner-user-profile.component.html',
  styleUrls: ['./partner-user-profile.component.scss']
})
export class PartnerUserProfileComponent implements OnInit {
  token: any;

  constructor() { }

  ngOnInit() {
    this.token = JSON.parse(localStorage.getItem("memberData")).token;
  }

}
