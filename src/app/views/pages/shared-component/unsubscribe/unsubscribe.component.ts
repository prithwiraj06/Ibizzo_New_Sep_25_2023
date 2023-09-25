import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";
import { DigitalFlyerService } from "../../../../../provider/digital-flyers/digital-flyer.service";
import { ActivatedRoute } from "@angular/router";
import { InviteService } from "../../../../../provider/invite/invite.service";
@Component({
  selector: "kt-unsubscribe",
  templateUrl: "./unsubscribe.component.html",
  styleUrls: ["./unsubscribe.component.scss"],
})
export class UnsubscribeComponent implements OnInit {
  partnerId: any;
  memberId: any;
  id: any;
  memberCompanyId: any;
  @Input() type: any;

  isUnsubscribe: boolean = false;
  constructor(
    private service: DigitalFlyerService,
    private activedRouter: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private invite: InviteService
  ) {}

  ngOnInit() {
    this.activedRouter.queryParams.subscribe((param) => {
      console.log("param", param);
      if (param && param.PartnerId && param.MemberId) {
        this.partnerId = param.PartnerId;
        this.memberId = param.MemberId.includes("/")
          ? param.MemberId.slice(0, -1)
          : param.MemberId;
        if (this.partnerId && this.memberId && this.type == "news-letter") {
          this.unsubscribeNewsletter();
        }
      } else if (param && param.Id && param.MemberCompanyId) {
        this.id = param.Id;
        console.log("meneb", param.MemberCompanyId);
        this.memberCompanyId = param.MemberCompanyId.includes("/")
          ? param.MemberCompanyId.slice(0, -1)
          : param.MemberCompanyId;
        console.log("data", this.id, this.memberCompanyId, this.type);
        if (this.id && this.memberCompanyId && this.type == "member") {
          console.log("data2", this.id, this.memberCompanyId, this.type);

          this.unsubscribeMemberInvite();
        }
      }
    });
  }
  async unsubscribeNewsletter() {
    try {
      let data = {
        partnerId: this.partnerId,
        memberId: this.memberId,
      };
      let res: any = await this.service.unsubscribeNewsletter(data);
      console.log(res);
      if (res.message == "Member unsubscribed successfuly") {
        this.isUnsubscribe = true;
        this.cd.detectChanges();
      }
    } catch (err) {
      console.log(err);
    }
  }
  async unsubscribeMemberInvite() {
    try {
      let data = {
        id: this.id,
        memberCompanyId: this.memberCompanyId,
      };
      let res: any = await this.invite.unsubscribeMemberInvite(data);
      if (res.message == "Member unsubscribed successfuly") {
        this.isUnsubscribe = true;
        this.cd.detectChanges();
      }
    } catch (err) {
      console.log(err);
    }
  }
}
