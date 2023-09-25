import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-list-manage-groups',
  templateUrl: './list-manage-groups.component.html',
  styleUrls: ['./list-manage-groups.component.scss']
})
export class ListManageGroupsComponent implements OnInit {
  product: boolean = true;
  discussion: boolean;
  setting: boolean;
  groupId: any;
  isTrue: any;
  selectedIndex: number = 0;

  onTabPanelClick(event) {
    this.product = event.index === 0 ? true : false;
    this.discussion = event.index === 1 ? true : false;
    this.setting = event.index === 2 ? true : false;
  }

  constructor(private activedRouter: ActivatedRoute) { }

  ngOnInit() {
    this.activedRouter.params.subscribe((param) => {
      console.log(param);
      if (param && param.id) {
        this.groupId = param.id;
        this.isTrue = param.query ? true : false;
      }
    });

    if (this.isTrue) {
      this.setting = true;
      this.selectedIndex = 2;
    }
  }
}
