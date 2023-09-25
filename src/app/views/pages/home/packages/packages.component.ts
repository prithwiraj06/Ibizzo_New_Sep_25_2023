import { Component, OnInit } from '@angular/core';
import { MinisiteService } from "../../../../../provider/minisite/minisite.service";

@Component({
  selector: 'kt-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

  constructor(
    private service: MinisiteService,
  ) {
    this.service.broadcastEvent("SEARCH", null);
  }

  ngOnInit() {
  }

}
