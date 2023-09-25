import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
declare var window: any;
import html2canvas from "html2canvas";
import { NewsletterService } from "../../../../../provider/newsletter/newsletter.service";
import { AuthService } from "../../auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "kt-newsletter-template",
  templateUrl: "./newsletter-template.component.html",
  styleUrls: ["./newsletter-template.component.scss"],
})
export class NewsletterTemplateComponent implements OnInit {
  @Input() useTemplate: any;
  @Output() valueChange = new EventEmitter<any>();
  @Output() id = new EventEmitter<any>();
  @Input() myNewsletter: any;
  @ViewChild("gjs", { static: false }) gjs: ElementRef;
  editor: any;
  memberInfo: any;
  memberData: any;
  initConfig: {
    height: number;
    plugins: string[];
    toolbar: string;
    image_advtab: boolean;
    imagetootinymcet_css: string[];
    external_plugins: { variables: string };
  };

  async send(templateName, subjectLine, isEnable?: any) {
    return await this.submit(templateName, subjectLine, isEnable);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private newsletterService: NewsletterService,
    private authService: AuthService,
    private toastr: ToastrService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    let self = this;
    this.memberData = this.authService.getCurrentUser();
    this.editor = window.grapesjs.init({
      container: "#gjs",
      fromElement: 1,
      storageManager: { type: 0 },
      colorPicker: {
        appendTo: "parent",
        offset: { top: 26, left: -166 },
      },
      plugins: self.myNewsletter
        ? ["gjs-blocks-basic"]
        : [
            "gjs-blocks-basic",
            "gjs-preset-newsletter",
            "gjs-preset-webpage",
            self.initConfig,
          ],
    });

    if (this.myNewsletter) {
      self.editor.setComponents(this.myNewsletter.htmlBody);
      self.editor.setStyle(this.myNewsletter.cssBody);

      let content: any = document.getElementsByClassName("gjs-frame")[0];
      let item = content.contentWindow;
      let info = item.document;
      info.body.style.cursor = "not-allowed";
      info.body.style.pointerEvents = "none";
      this.cd.detectChanges();
    } else {
      // content[0].classList.add('disable')
      this.activatedRoute.queryParams.subscribe((param: any) => {
        if (param && param.t) {
          let options: any = {
            headers: new HttpHeaders().set("Content-Type", "text/html"),
            responseType: "text",
          };
          this.http
            .get(
              `/assets/media/email-templates/${param.t}-template.html`,
              options
            )
            .subscribe((html: any) => {
              self.editor.setComponents(html);
            });
        } else if (param && param.id) {
          let params = {
            Token: "IBizzo",
            MemberId: this.authService.getUserId(),
            CompanyId: this.authService.getCompanyId(),
          };
          this.newsletterService.getDraftNewsLetter(params).then((res: any) => {
            if (param.id == res.templates[0].id) {
              self.editor.setComponents(res.templates[0].htmlBody);
              self.editor.setStyle(res.templates[0].cssBody);
              this.cd.detectChanges();
            }
          });
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.myNewsletter) {
      setTimeout(() => {
        let pre = this.editor.Commands;
        pre.run("preview");
        this.setPreview();
      }, 100);
      this.cd.detectChanges();
    }
  }

  setPreview() {
    let preview: any = document.getElementsByClassName("gjs-off-prv");
    console.log(preview);
    if (preview.length != 0) {
      preview[0].hidden = true;
    }
    this.cd.detectChanges();
  }

  save() {
    this.valueChange.emit({
      html: this.editor.getHtml(),
      css: this.editor.getCss(),
    });
  }

  async submit(templateName, subjectLine, isEnable?: any) {
    let compId = this.authService.getCompanyId();
    let memId = this.authService.getUserId();
    return new Promise(async (resolve, reject) => {
      let enCode;
      let element = this.gjs.nativeElement.getElementsByTagName("iframe")[0];
      var y = element.contentWindow || element.contentDocument;
      if (y.document) {
        y = y.document;
      } else {
        this.toastr.warning("Html body is empty");
        return;
      }
      console.log("conce", y.body);
      let res = await this.canvasConvert(y.body);
      if (res) {
        enCode = res;
        let data: any = {
          templateName: templateName,
          subjectLine: subjectLine,
          memberCompanyID: compId,
          memberId: memId,
          htmlBody: this.editor.getHtml(),
          cssBody: this.editor.getCss(),
          dataUri: enCode,
          type: 0,
        };
        if (isEnable) {
          data.id = isEnable.id;
          this.newsletterService
            .updateTemplates(data)
            .then((res: any) => {
              if (!res.includes("Excepiton")) {
                this.id.emit(parseInt(res));
              }
              resolve(res);
            })
            .catch((err) => {
              console.log(err);
              reject();
            });
        } else {
          this.newsletterService
            .createTemplates(data)
            .then((res: any) => {
              if (!res.includes("Excepiton")) {
                this.id.emit(parseInt(res));
              }
              resolve(res);
            })
            .catch((err) => {
              console.log(err);
              reject();
            });
        }
      } else {
        this.toastr.error("Failed to create the template");
        reject();
      }
    });
  }

  canvasConvert(body) {
    return new Promise((resolve, reject) => {
      html2canvas(body)
        .then(function (canvas) {
          // Convert the canvas base64
          let enCode = canvas.toDataURL("image/jpeg", 0.1);
          resolve(enCode);
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  }
}
