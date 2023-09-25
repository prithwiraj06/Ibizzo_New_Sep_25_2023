import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";
import { PartnerService } from "../../../../../provider/partner/partner.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import Swiper from "swiper";
import { CreateGroupClusterComponent } from "../create-group-cluster/create-group-cluster.component";
import { SuggestedClustersService } from "../../../../../provider/suggested-cluster/suggested-clusters.service";
import { UserProfileService } from "../../../../../provider/user-profile/user-profile.service";
declare var window: any;

@Component({
  selector: "kt-master-cards",
  templateUrl: "./master-cards.component.html",
  styleUrls: ["./master-cards.component.scss"],
})
export class MasterCardsComponent implements OnInit {
  data: any = [];
  mySwiper: Swiper;
  @Input() source: any;
  filteredArray: any = [];

  constructor(
    private partnerService: PartnerService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private cluster: SuggestedClustersService,
    private userProfile: UserProfileService
  ) { }

  ngOnInit() {
    console.log("MAster", this.source);
    this.listGroup();
  }

  async listGroup() {
    if (!this.source) {
      this.data = this.partnerService.getCachedPartners();
    } else {
      this.data = await this.cluster.getMyGroupsWithPartners();
    }
    if (this.data && this.data.length != 0) {
      this.data.forEach((element) => {
        if (element.isView) {
          this.filteredArray.push(element);
        }
      });
    } else {
      this.filteredArray = this.data;
    }

    if (this.filteredArray && this.filteredArray.length) {
      setTimeout(() => {
        this.mySwiper = new Swiper(".marketplace-swiper-container", {
          paginationClickable: true,
          nextButton: ".marketplace-swiper-button-next",
          prevButton: ".marketplace-swiper-button-prev",
          slidesPerView: window.KTUtil.isMobileDevice()
            ? 1
            : this.source
              ? 4
              : 3,
          spaceBetween: 0,
          freeMode: true,
          pagination: {
            el: ".marketplace-swiper-pagination",
            type: "fraction",
          },
        });
        this.cd.detectChanges();
      }, 500);
    }
  }

  getUrl(partner: any, path: string) {
    const location: any = document.location;
    const partnerName = this.partnerService.removeSpaces(partner.name);
    return `/${partnerName}/${path}`;
  }

  getgroups(path) {
    return "/settings/28";
  }

  goPrev() {
    this.mySwiper.slidePrev();
  }

  goNext() {
    this.mySwiper.slideNext();
  }

  crateGroup() {
    const dialogRef = this.dialog.open(CreateGroupClusterComponent, {
      data: "isBussiness",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        false;
      }
      this.listGroup();
    });
  }

  getImage(event) {
    if (this.source) {
      if (event && event.icon && event.icon.includes(".")) {
        return this.userProfile.downloadImage(event.icon);
      } else {
        return "../../../../../assets/images/Product-Detail-No-Image.png";
      }
    } else {
      return event.logo;
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
}
