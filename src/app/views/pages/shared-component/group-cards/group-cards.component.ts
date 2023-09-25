import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UserProfileService } from "../../../../../provider/user-profile/user-profile.service";
import { SuggestedClustersService } from "../../../../../provider/suggested-cluster/suggested-clusters.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material";
import { AssignRoleInGroupComponent } from "../assign-role-in-group/assign-role-in-group.component";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "kt-group-cards",
  templateUrl: "./group-cards.component.html",
  styleUrls: ["./group-cards.component.scss"],
})
export class GroupCardsComponent implements OnInit {
  @Input() isNameEnable: boolean;
  @Input() isCluster: boolean;
  @Input() group: any;
  @Input() buttonLabel: any;
  @Input() colors: any;
  @Input("shadow") className: string = "less";
  @Input() isMyGroup: any;
  @Output() valueChange = new EventEmitter();

  buttonStyleColor: { backgroundColor: any; color: any };
  queryParam: string;
  memberDetails: any;
  constructor(
    private userProfile: UserProfileService,
    private cluster: SuggestedClustersService,
    private toastr: ToastrService,
    public authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.memberDetails = this.authService.getCurrentUser();
    if (!this.colors) {
      this.colors = {
        accentColor: "#CC0011",
        alternateColor: "#FFFFFF",
      };
    }
    this.buttonStyleColor = {
      backgroundColor: this.colors.accentColor,
      color: this.colors.alternateColor,
    };
    this.className = "card " + this.className;
  }

  viewImage(image) {
    if (image.icon.includes(".")) {
      if (image.icon == "Please Upload image of type .jpg,.gif,.png.") {
        return "../../../../../assets/media/placeholder/product.jpg";
      } else {
        return this.userProfile.downloadImage(image.icon);
      }
    } else if (image.partnerId && image.companyLogo) {
      console.log("icon image********", image.icon);

      return this.userProfile.downloadImage(image.companyLogo);
    } else {
      return "../../../../../assets/media/placeholder/product.jpg";
    }
  }

  valueChanged(event) {
    // You can give any function name
    this.valueChange.emit(event);
  }

  async joinGroup(group) {
    let res: any = await this.cluster.joinGroup(group.id);
    console.log(res);
    if (res.message == "Member has been registered to group") {
      this.toastr.success("Join request sent.");
    } else {
      this.toastr.warning(
        "Join request has been sent waiting for admin approval."
      );
    }
  }

  openService(group) {
    const dialogRef = this.dialog.open(AssignRoleInGroupComponent, {
      disableClose: true,
      data: {
        isSearch: true,
      },
    });
    dialogRef.afterClosed().subscribe(async (res: any) => {
      if (!res) {
        return false;
      }
      console.log(res);
      let params = {
        groupId: group.id,
        memberId: res.memberId,
      };
      let result: any = await this.cluster.assignMemberAsAdmin(params);
      console.log(result);
      if (result.message == "Admin has been assigned to group") {
        this.toastr.success("Successfully assigned thhe member as Admin");
        this.valueChanged("Partner page");
      } else {
        this.toastr.error(result.message);
      }
    });
  }

  getTitle(group) {
    if (group && group.memberName) {
      return group.memberName + " Assigned as Admin";
    } else {
      return "Search Members & Assign Admin";
    }
  }

  getOwner(info, isCheck) {
    if (isCheck == "isOwner" && (info.isAdmin == 1 || info.isOwner == 1)) {
      return true;
    } else if (isCheck == "isMember" && info.isMember == 1) {
      return true;
    } else {
      return false;
    }
  }

  addMember(group) {
    const dialogRef = this.dialog.open(AssignRoleInGroupComponent, {
      data: {
        isMember: true,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(async (res: any) => {
      if (!res) {
        return false;
      }
      console.log(res);
      let params = {
        groupId: group.id,
        list: res,
      };
      let result: any = await this.cluster.addMemberToGroup(params);
      console.log(result);
      if (result.message == "Member added to partner group") {
        this.toastr.success("Successfully Member added to partner group");
      } else {
        this.toastr.error(result.message);
      }
    });
  }
  view(group) {
    this.queryParam =
      this.memberDetails.companyName
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      group.id +
      ".html";
    if (this.queryParam) {
      window.open("/m/p/g/" + this.queryParam, "_blank");
    }
  }
}
