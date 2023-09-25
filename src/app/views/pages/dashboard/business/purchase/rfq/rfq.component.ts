import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss']
})
export class RfqComponent implements OnInit {

  id: any;
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      if (param.id) {
        this.id = param.id;
      }
    });
  }



}
