import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "kt-public-group-page",
  templateUrl: "./public-group-page.component.html",
  styleUrls: ["./public-group-page.component.scss"],
})
export class PublicGroupPageComponent implements OnInit {
  product: boolean = true;
  discussion: boolean;
  setting: boolean;
  groupId: any;
  isTrue: any;
  selectedIndex: number = 0;

  onTabPanelClick(event) {
    this.product = event.index === 0 ? true : false;
    this.discussion = event.index === 1 ? true : false;
  }

  constructor(private activedRouter: ActivatedRoute) {}

  ngOnInit() {
    this.activedRouter.fragment.subscribe((param) => {});
    let groupInfo = this.activedRouter.snapshot.params.id;
    if (groupInfo) {
      let arrInfo = groupInfo.split("-");
      this.groupId = arrInfo[arrInfo.length - 1].split(".")[0];
    }

    if (this.isTrue) {
      this.setting = true;
      this.selectedIndex = 2;
    }
  }
}
