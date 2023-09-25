import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SuggestedClustersService } from "../.././../../../../provider/suggested-cluster/suggested-clusters.service";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: "kt-list-section",
  templateUrl: "./list-section.component.html",
  styleUrls: ["./list-section.component.scss"],
})
export class ListSectionComponent implements OnInit {
  product: boolean = true;
  discussion: boolean;
  setting: boolean;
  groupId: any;
  isTrue: any;
  selectedIndex: number = 0;
  isShow: boolean = true;

  onTabPanelClick(event) {
    this.product = event.index === 0 ? true : false;
    this.discussion = event.index === 1 ? true : false;
    this.setting = event.index === 2 ? true : false;
  }

  constructor(private activedRouter: ActivatedRoute,
    private cluster: SuggestedClustersService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
   let memberData = this.authService.getCurrentUser();
    this.activedRouter.params.subscribe(async (param) => {
      console.log(param);
      if (param && param.id) {
        debugger
        this.groupId = param.id;
        this.isTrue = param.query ? true : false;
        let res:any = await this.cluster.getGroupDetails(param.id)
        if (res&&memberData) {
          this.isShow=memberData.id==parseInt(res.adminId)?true:false
        }
      }
    });

    if (this.isTrue) {
      this.setting = true;
      this.selectedIndex = 2;
    }
  }
}
