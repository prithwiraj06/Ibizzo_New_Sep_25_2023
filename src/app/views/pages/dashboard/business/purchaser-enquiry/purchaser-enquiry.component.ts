import { Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { EnquiryService } from '../../../../../../provider/enquiry/enquiry.service'
import { AuthService } from '../../../auth/auth.service'
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../../../../../../provider/base-service/base.service';
import { Router } from '@angular/router';
import { BaseUrlPipe } from '../../../../../core/_base/layout/pipes/base-url'
@Component({
  selector: 'kt-purchaser-enquiry',
  templateUrl: './purchaser-enquiry.component.html',
  styleUrls: ['./purchaser-enquiry.component.scss']
})

export class PurchaserEnquiryComponent implements OnInit {
  public enquiries: any = [];
  public messages: any = [];
  public loadingEnquiries: boolean = true;
  public loadingMessages: boolean = false;
  public sendingMessage: boolean = false;
  public noCreditAvailableToRespondEnquiry: boolean = false;

  public currentUser: any;
  public selectedEnquiry: any = null;
  public chat: any = {
    message: '',
    attachment: {
      name: '',
      size: ''
    }
  };
  loading: any = {
    "chat": true,
  }

  constructor(
    private enquiryService: EnquiryService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private toastr: ToastrService,
    private baseService: BaseService,
    public router: Router,
    private baseUrlPipe: BaseUrlPipe,
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  async ngOnInit() {
    try {
      this.enquiryService.init('PurchaserEnquiry');
      this.enquiries = await this.enquiryService.findAll(this.currentUser.id, this.currentUser.companyId);

      this.loadingEnquiries = false;
      this.cd.detectChanges();
    } catch (e) { this.loadingEnquiries = false; }
  }

  goToChat(fragment: any) {
    this.loading.chat = fragment
    this.router.navigate([this.baseUrlPipe.transform(['/dashboard/business/purchase/enquiry'])],
      {
        fragment: fragment
      }
    )
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

  initiateChat(item: any) {
    if (this.selectedEnquiry && this.selectedEnquiry.serialNumber) {
      this.toggleClass(this.selectedEnquiry.serialNumber);
    }

    this.selectedEnquiry = item;
    this.toggleClass(this.selectedEnquiry.serialNumber);
    this.getMessages(true);
  }

  async getMessages(detectChanges: boolean) {
    try {
      const item: any = this.selectedEnquiry;
      const result: any = await this.enquiryService.findMessages(this.authService.getUserId(), item.enquiryId);
      result.message = (result.message || '').toLowerCase();

      if (result.message === 'no credits') {
        this.noCreditAvailableToRespondEnquiry = true;
        this.toastr.error('No Credits Avaialble');
        return false;
      }

      if (result.message === 'credits deducted') {
        // show toast message about 'Credit Deduction'
        this.toastr.info('Credits Deduced');
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
    let container: HTMLElement = document.getElementById("enquiry-item-" + index);
    container.classList.toggle('active');
  }

  getMessageClass(message: any) {
    let className: string = 'kt-chat__message';
    className += (message.memberId == this.currentUser.id) ? ' kt-chat__message--right' : '';
    return className;
  }

  async reply() {
    let exp = RegExp(/^[^-\s][a-zA-Z0-9_\s-]+$/);
    let data1 = exp.test(this.chat.message.trim());
    if (!data1) {
      return false;
    }

    // upload image
    let quotationDocumentName: any = '';
    if (this.chat.attachment.readyToUpload) {
      quotationDocumentName = await this.enquiryService.uploadImage(this.chat.attachment.file);
      this.chat.attachment = {
        name: '',
        size: ''
      };
    }

    // send chat message
    try {
      this.sendingMessage = true;
      await this.enquiryService.sendMessage({
        "purchaserEnquiryId": this.selectedEnquiry.enquiryId,
        "token": this.currentUser.id,
        "message": this.chat.message,
        "quotationDocumentName": quotationDocumentName
      });

      // get latest messages
      await this.getMessages(false);
      this.chat.message = '';
      this.sendingMessage = false;
      this.scrollToBottom();
      this.cd.detectChanges();

    } catch (e) {
      this.sendingMessage = false;
      console.log(e);
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      //  scroll to bottom
      let container: HTMLElement = document.getElementById("chatMessageContainer");
      container.scrollTop = container.scrollHeight;
    }, 1000);
  }

  detectFiles(event: any) {
    let files = event.target.files;
    let checkFileTypeValid = false;
    if (files) {
      for (let file of files) {
        if (
          file.name.indexOf('jpg') >= 0 ||
          file.name.indexOf('png') >= 0 ||
          file.name.indexOf('jpeg') >= 0 ||
          file.name.indexOf('pdf') > 0 ||
          file.name.indexOf('pdf') >= 0 ||
          file.name.indexOf('docx') >= 0
        ) {
          checkFileTypeValid = true;
          this.chat.attachment = {
            name: file.name,
            size: Math.round(file.size / 1024) + 'KB',
            readyToUpload: false,
            file: file
          }

        } else {
          alert("Please Upload image of type .jpg, .png.");
          break;
        }

        if (file.size < 1200000) {
          this.chat.attachment.readyToUpload = true;
        } else {
          alert("Please Upload image Size less than 200 KB.")
          break;
        }
      }
    }
  }

  getUrl(document: any) {
    document = this.baseService.getImageUrl(document, 'GetQuoteDownload');
    return document
  }
}