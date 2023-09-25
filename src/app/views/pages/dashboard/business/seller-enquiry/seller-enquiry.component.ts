import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { EnquiryService } from "../../../../../../provider/enquiry/enquiry.service";
import { AuthService } from "../../../auth/auth.service";
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
import { MatDialog } from "@angular/material";
import { QuoteDetailsComponent } from "../quote-details/quote-details.component";
import { InvoiceComponent } from "../invoice/invoice.component";
import Swal from "sweetalert2";
import { BaseService } from "../../../../../../provider/base-service/base.service";
import { Router, ActivatedRoute } from "@angular/router";
import { BaseUrlPipe } from "../../../../../core/_base/layout/pipes/base-url";

declare var $: any;
@Component({
  selector: "kt-seller-enquiry",
  templateUrl: "./seller-enquiry.component.html",
  styleUrls: ["./seller-enquiry.component.scss"],
})
export class SellerEnquiryComponent implements OnInit {
  public enquiries: any = [];
  public messages: any = [];
  public loadingEnquiries: boolean = true;
  public loadingMessages: boolean = false;
  public sendingMessage: boolean = false;
  public loadingCredits: boolean = false;
  public noCreditAvailableToRespondEnquiry: boolean;

  public currentUser: any;
  public selectedEnquiry: any = null;
  public chat: any = {
    message: "",
    attachment: {
      name: "",
      size: "",
    },
  };
  quotes: any = 0;
  leftQuotes: any = 0;
  selectItem: any;
  index: any;
  content: any;
  memberData: any;
  navId: any;

  loading: any = {
    chat: true,
  };

  constructor(
    private enquiryService: EnquiryService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private baseService: BaseService,
    public router: Router,
    private baseUrlPipe: BaseUrlPipe,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  async ngOnInit() {
    this.memberData = this.authService.getCurrentUser();
    await this.enqiryDetails();
    this.activatedRoute.params.subscribe(async (res: any) => {
      if (res && res.id) {
        await this.addEnquiryForMember(res);
      }
    });
    await this.getCreditsDetails();
  }

  goToChat(fragment: any) {
    this.loading.chat = fragment;
    if (this.navId) {
      this.router.navigate(
        [
          this.baseUrlPipe.transform([
            "/dashboard/business/sales/enquiry/" + this.navId,
          ]),
        ],
        {
          fragment: fragment,
        }
      );
    } else {
      this.router.navigate(
        [this.baseUrlPipe.transform(["/dashboard/business/sales/enquiry"])],
        {
          fragment: fragment,
        }
      );
    }
  }

  ngAfterViewChecked() {
    if (this.loading.chat) {
      var ele = document.getElementById(this.loading.chat);
      if (ele) {
        ele.scrollIntoView({ behavior: "smooth" });
        let time = setInterval(() => {
          this.loading.fragment = true;
          clearInterval(time);
        }, 500);
      }
    }
  }

  async enqiryDetails() {
    return new Promise(async (resolve, rejects) => {
      try {
        this.enquiryService.init("SupplierEnquiry");
        this.enquiries = await this.enquiryService.findAll(
          this.currentUser.id,
          this.currentUser.companyId
        );

        this.loadingEnquiries = false;

        this.cd.detectChanges();
        resolve();
      } catch (e) {
        this.loadingEnquiries = false;
      }
      this.cd.detectChanges();
      rejects();
    });
  }

  getCreditsDetails() {
    return new Promise(async (resolve) => {
      this.loadingCredits = true;
      this.enquiryService
        .getUserCredits(this.authService.getUserId())
        .then((res: any) => {
          this.leftQuotes = res.userDetails ? res.userDetails.credits : 0;
          this.loadingCredits = false;
          this.cd.detectChanges();
          resolve();
        });
      this.cd.detectChanges();
    });
  }

  async initiateChat(item: any, i: any) {
    this.index = i;
    this.selectItem = i;
    if (item.isQuoteDeducted == "False" && this.leftQuotes > 0) {
      this.selectedEnquiry = null;
      this.cd.detectChanges();
      Swal.fire({
        title: "Your credits would be deducted",
        text: "Would you like to continue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
      }).then((result: any) => {
        if (result && result.value) {
          if (this.selectedEnquiry && this.selectedEnquiry.serialNumber) {
            this.toggleClass(this.selectedEnquiry.serialNumber);
          }
          this.getMessages(true, item);
          this.toggleClass(item.serialNumber);
        } else {
          return;
        }
      });
    } else {
      if (this.selectedEnquiry && this.selectedEnquiry.serialNumber) {
        this.toggleClass(this.selectedEnquiry.serialNumber);
      }
      this.getMessages(true, item);
      this.toggleClass(item.serialNumber);
    }
  }

  getUrl(document: any) {
    document = this.baseService.getImageUrl(document, "GetQuoteDownload");
    return document;
  }

  async getMessages(detectChanges: boolean, item) {
    try {
      // const item: any = this.selectedEnquiry;
      const result: any = await this.enquiryService.findMessages(
        this.authService.getUserId(),
        item.enquiryId
      );
      result.message = (result.message || "").toLowerCase();

      if (result.message === "no credits") {
        this.noCreditAvailableToRespondEnquiry = true;
        this.messages = [];
        this.toastr.error("No Credits Avaialble");
        this.cd.detectChanges();
        return false;
      }
      this.selectedEnquiry = item;

      if (result.message === "credits deducted") {
        let res = await this.getChanges();
        if (res) {
          this.initiateChat(this.content, this.index);
        }
      }

      this.noCreditAvailableToRespondEnquiry = false;

      this.messages = result.enquiryMessages;

      this.loadingMessages = false;
      if (detectChanges) {
        this.cd.detectChanges();
        this.scrollToBottom();
      }
    } catch (e) {
      this.noCreditAvailableToRespondEnquiry = false;
      this.loadingMessages = false;
    }
  }

  toggleClass(index: number) {
    let container: HTMLElement = document.getElementById(
      "enquiry-item-" + index
    );
    container.classList.toggle("active");
  }

  getMessageClass(message: any) {
    let className: string = "kt-chat__message";
    className +=
      message.memberId == this.currentUser.id ? " kt-chat__message--right" : "";
    return className;
  }

  async reply() {
    let exp = RegExp(/^[^-\s][a-zA-Z0-9_\s-]+$/);
    let data1 = exp.test(this.chat.message.trim());
    if (!data1) {
      return false;
    }

    // upload image
    let quotationDocumentName: any = "";
    if (this.chat.attachment.readyToUpload) {
      quotationDocumentName = await this.enquiryService.uploadImage(
        this.chat.attachment.file
      );
      this.chat.attachment = {
        name: "",
        size: "",
      };
    }

    // send chat message
    try {
      this.sendingMessage = true;
      await this.enquiryService.sendMessage({
        purchaserEnquiryId: this.selectedEnquiry.enquiryId,
        token: this.currentUser.id,
        message: this.chat.message,
        quotationDocumentName: quotationDocumentName,
      });

      // get latest messages
      await this.getMessages(false, this.selectedEnquiry);
      this.chat.message = "";
      this.sendingMessage = false;
      this.scrollToBottom();
      this.cd.detectChanges();
    } catch (e) {
      this.sendingMessage = false;
      console.log(e);
    }
  }

  addCredits(leads?: any) {
    const dialogRef = this.dialog.open(QuoteDetailsComponent, {
      width: "500px",
      data: {
        value: true,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      this.toastr.success(`Leads Purchase Successful`);

      if (leads) {
        await this.getChanges(leads);
      } else {
        this.getCreditsDetails();
        this.enqiryDetails();
      }
    });
  }

  async getChanges(leads?: any) {
    return new Promise(async (resolve, rejects) => {
      await this.getCreditsDetails();
      await this.enqiryDetails();
      this.content = this.enquiries[this.index];
      let count = this.index + 1;
      let id = "enquiry-item-" + count;
      document.getElementById(id).scrollIntoView();
      this.selectItem = this.index;
      if (leads) {
        // this.noCreditAvailableToRespondEnquiry = false;
        this.initiateChat(this.content, this.index);
      }
      this.cd.detectChanges();
      resolve(true);
    });
  }

  createProformaInvoice() {
    const dialogRef = this.dialog.open(InvoiceComponent, {
      data: this.selectedEnquiry,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      this.enqiryDetails();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      //  scroll to bottom
      let container: HTMLElement = document.getElementById(
        "chatMessageContainer"
      );
      container.scrollTop = container.scrollHeight;
    }, 1000);
  }

  getCompanyName(item: any) {
    if (item.isQuoteDeducted == "True") {
      return item.sellerCompanyName + " / ";
    }
  }
  scrollToAnchor(location?: string, wait = 0): void {
    if (location) {
      var ele = document.getElementById(location);
      console.log("ele", ele, location);
      if (ele) {
        ele.scrollIntoView({ behavior: "smooth" });
        let time = setInterval(() => {
          clearInterval(time);
        }, 500);
      }
      setTimeout(function () {
        document.getElementById(location).click();
      }, 2000);
    }
  }
  detectFiles(event: any) {
    let files = event.target.files;
    let checkFileTypeValid = false;
    if (files) {
      for (let file of files) {
        if (
          file.name.indexOf("jpg") >= 0 ||
          file.name.indexOf("png") >= 0 ||
          file.name.indexOf("jpeg") >= 0 ||
          file.name.indexOf("pdf") > 0 ||
          file.name.indexOf("pdf") >= 0 ||
          file.name.indexOf("docx") >= 0
        ) {
          checkFileTypeValid = true;
          this.chat.attachment = {
            name: file.name,
            size: Math.round(file.size / 1024) + "KB",
            readyToUpload: false,
            file: file,
          };
        } else {
          alert("Please Upload image of type .jpg, .png.");
          break;
        }

        if (file.size < 1200000) {
          this.chat.attachment.readyToUpload = true;
        } else {
          alert("Please Upload image Size less than 200 KB.");
          break;
        }
      }
    }
  }
  async addEnquiryForMember(data: any) {
    if (data && data.id) {
      this.navId = data.id;
      this.scrollToAnchor(data.id);
      this.toastr.success("Enquiry is sent");
    } else {
      this.toastr.error("Error in sending enquiry");
    }
  }
}
