import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
} from "@angular/core";
import { UserProfileService } from "../../../../../../provider/user-profile/user-profile.service";
import { AuthService } from "../../../auth/auth.service";
declare var window: any;

@Component({
  selector: "kt-profile-completion",
  templateUrl: "./profile-completion.component.html",
  styleUrls: ["./profile-completion.component.scss"],
})
export class ProfileCompletionComponent implements OnInit {
  userDetails: any = {};
  init: number = 100;
  token: any;
  totalPercentage: number = 0;
  fillPercent: boolean = false;
  fields: any = 0;
  public selectRef: any;
  constructor(
    private userProfile: UserProfileService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.token = this.authService.getUserId();
    this.getUserDetails();
  }

  async getUserDetails() {
    const self: any = this;

    try {
      if (this.token) {
        let userData: any = await this.userProfile.getProfile(this.token);
        this.userDetails = userData.userDetails;

        let percentageData: any = {
          aboutYourCompany: this.userDetails.aboutYourCompany,
          companyName: this.userDetails.companyName,
          logo: this.userDetails.logo,
          email: this.userDetails.email,
          phoneNumber: this.userDetails.phoneNumber,
          employeeCount: this.userDetails.employeeCount,
          companyDocuments: this.userDetails.companyDocuments,
          companyImages: this.userDetails.companyImages,
          companyVideos: this.userDetails.companyVideos,
          address: this.userDetails.address,
          location: this.userDetails.location,
          registrationDate: this.userDetails.registrationDate,
          name: this.userDetails.name,
        };

        Object.keys(percentageData).forEach((key) => {
          if (key === "companyImages") {
            if (
              percentageData[key] &&
              percentageData[key].length > 0 &&
              percentageData[key][0].imageName
            ) {
              this.fields = this.fields + 1;
            }
          } else {
            if (percentageData[key] && percentageData[key].length > 0) {
              this.fields = this.fields + 1;
              this.totalPercentage =
                this.fields / Object.keys(percentageData).length;
            }
          }
        });
      }

      var progressBarOptions = {
        startAngle: -1.55,
        size: 65,
        value: this.totalPercentage,
        fill: {
          color: "#fc913f",
        },
      };
      this.selectRef = window.jQuery(this.el.nativeElement).find(".circle");
      window
        .jQuery(this.selectRef)
        .circleProgress(progressBarOptions)
        .on("circle-animation-progress", function (
          event,
          progress,
          stepValue
        ) { });
      this.totalPercentage = this.totalPercentage * 100;
      this.totalPercentage = Math.floor(this.totalPercentage);
      this.cd.detectChanges();
    } catch (e) {
      console.log(e);
    }
  }

}
