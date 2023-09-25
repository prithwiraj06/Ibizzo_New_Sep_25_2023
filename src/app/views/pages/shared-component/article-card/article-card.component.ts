import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  ViewChild,
} from "@angular/core";
import { CommentBoxComponent } from "../comment-box/comment-box.component";
import { MatDialog } from "@angular/material/dialog";
import { CreateArticlePostComponent } from "../create-article-post/create-article-post.component";
import { VideoPostComponent } from "../video-post/video-post.component";
import { DomSanitizer } from "@angular/platform-browser";
import { SettingService } from "../../../../../provider/setting/setting.service";
import { RfqWithoutIdComponent } from "../rfq-without-id/rfq-without-id.component";
import { MemberDetailsComponent } from "../member-details/member-details.component";
import { MatPaginator } from "@angular/material";
import { AuthService } from "../../auth/auth.service";
import { PartnerService } from "../../../../../provider/partner/partner.service";

@Component({
  selector: "kt-article-card",
  templateUrl: "./article-card.component.html",
  styleUrls: ["./article-card.component.scss"],
})
export class ArticleCardComponent implements OnInit {
  @Input() isProduct: any;
  @Input() partnerId: any;
  @Input() groupId: any;
  listOfPosts: any = [];
  isPublic: boolean;
  videos: any = [];
  videoLinks: any = [];
  articles: any = [];
  firstArray: any = [];
  secondArray: any = [];
  thirdArray: any = [];
  indexValue: number = 1;
  pageSize: number = 12;
  finalArray: any = [];
  listOfProduct: any = [];
  productLinkUrl: string[];
  loadingDiscussions: boolean;
  loadingProduct: boolean;
  finalArrayProduct: any = [];
  secondArrayProduct: any = [];
  thirdArrayProduct: any = [];
  firstArrayProduct: any = [];
  fourthArray: any = [];
  fourthArrayProduct: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  memberData: any;
  isPartner: boolean;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private authService: AuthService,
    private setting: SettingService,
    private sanitizer: DomSanitizer,
    private partner: PartnerService
  ) {}

  ngOnInit() {
    this.isPartner = window.location.href.includes("/pages/home")
      ? true
      : false;
    this.memberData = this.authService.getCurrentUser();
    this.getGroupPost(this.indexValue, this.pageSize);
    this.getGroupProduct(this.indexValue, this.pageSize);
    this.isPublic = this.partnerId ? true : false;
  }
  comment(item) {
    const dialogRef = this.dialog.open(CommentBoxComponent, {
      data: item,
      width: "700px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.cd.detectChanges();
        return;
      }
    });
  }
  viewMember(item) {
    const dialogRef = this.dialog.open(MemberDetailsComponent, {
      data: { groupId: this.groupId, memberId: item.postMemberId },
      width: "380px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.cd.detectChanges();
        return;
      }
    });
  }
  createArticle() {
    let indexValue = 1;
    let pageSize = 12;
    const dialogRef = this.dialog.open(CreateArticlePostComponent, {
      data: {
        id: this.partnerId ? this.partnerId : this.groupId,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getGroupPost(indexValue, pageSize, true);
      if (!result) {
        this.cd.detectChanges();
        return;
      }
    });
  }
  createVideo() {
    let indexValue = 1;
    let pageSize = 12;
    const dialogRef = this.dialog.open(VideoPostComponent, {
      data: { id: this.partnerId ? this.partnerId : this.groupId },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getGroupPost(indexValue, pageSize);

      if (!result) {
        this.cd.detectChanges();
        return;
      }
    });
  }

  openRFQ() {
    const dialogRef = this.dialog.open(RfqWithoutIdComponent, {
      data: "groups",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
    });
  }

  async getGroupPost(indexValue, pageSize, isPost?) {
    this.loadingDiscussions = true;
    console.log("post", isPost);
    this.listOfPosts = isPost ? [] : this.listOfPosts;

    try {
      if (!this.isProduct) {
        let data = {
          id: this.partnerId ? this.partnerId : this.groupId,
          pageNumber: indexValue,
          records: pageSize,
        };
        let res: any = this.isPartner
          ? await this.partner.getPartnerPosts(data)
          : await this.setting.getGroupPostsList(data);
        if (res.length > 0) {
          res.forEach(async (item) => {
            if (item.contentType == "video") {
              this.listOfPosts.push(this.getVedioesLink(item));
            } else if (
              item.contentType == "link" ||
              item.contentType == "article"
            ) {
              this.listOfPosts.push(item);
            }
          });
          console.log("postdata", this.listOfPosts);

          const filteredArr = this.listOfPosts.reduce((acc, current) => {
            const x = acc.find((item) => item.id === current.id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          this.finalArray = await this.splitArray(filteredArr);
          this.firstArray = this.finalArray[0];
          this.secondArray = this.finalArray[1];
          this.thirdArray = this.finalArray[2];
          if (window.location.href.includes("p/g") || this.isPartner) {
            this.isPublic = true;
            this.fourthArray = this.finalArray[3];
            this.cd.detectChanges();
          }
          this.loadingDiscussions = false;
          this.cd.detectChanges();
        } else {
          this.loadingDiscussions = false;
          this.cd.detectChanges();
        }
      }
    } catch (err) {
      this.loadingDiscussions = false;
      console.log(err);
    }
  }
  async getGroupProduct(indexValue, pageSize) {
    this.loadingProduct = true;
    try {
      if (this.isProduct) {
        let data = {
          groupId: this.groupId,
          pageNumber: indexValue,
          records: pageSize,
        };
        let res: any = await this.setting.getGroupProductList(data);
        this.loadingProduct = false;
        this.cd.detectChanges();
        if (res.length > 0) {
          res.forEach((element) => {
            this.listOfProduct.push(element);
          });

          this.finalArrayProduct = await this.splitArray(this.listOfProduct);
          this.firstArrayProduct = this.finalArrayProduct[0];
          this.secondArrayProduct = this.finalArrayProduct[1];
          this.thirdArrayProduct = this.finalArrayProduct[2];
          if (window.location.href.includes("p/g")) {
            this.isPublic = true;
            this.fourthArrayProduct = this.finalArrayProduct[3];
            this.cd.detectChanges();
          }
        } else {
          this.loadingProduct = false;
        }
      }
    } catch (err) {
      this.loadingProduct = false;
      console.log(err);
    }
  }
  splitArray(items) {
    let n: any,
      result = [],
      wordsPerLine: any;

    if (window.location.href.includes("p/g") || this.isPartner) {
      n = 4;
      result = [[], [], [], []];
      wordsPerLine = Math.ceil(items.length / 4);
    } else {
      n = 3;
      result = [[], [], []];
      //we create it, then we'll fill it

      wordsPerLine = Math.ceil(items.length / 3);
    }

    for (let line = 0; line < n; line++) {
      for (let i = 0; i < wordsPerLine; i++) {
        const value = items[i + line * wordsPerLine];
        if (!value) continue; //avoid adding "undefined" values
        result[line].push(value);
      }
    }
    return result;
  }

  getVedioesLink(key) {
    if (key) {
      let id = this.getVedioById(key.contentLink);
      let video = this.sanitizer.bypassSecurityTrustResourceUrl(
        "https://www.youtube.com/embed/" + id + "?showinfo=0&rel=0"
      );
      return { video: video, id: key.id, postMemberId: key.postMemberId };
    }
  }
  getVedioById(video) {
    let str = video.split("?")[1] || "";
    let data = str.split("=");
    let index = data.indexOf("v");
    return index > -1 ? data[index + 1] : undefined;
  }
  scrollDown(event, type) {
    if (event) {
      this.indexValue = this.indexValue + this.pageSize;
      this.pageSize = this.pageSize + this.pageSize;
      if (type === "discussion") {
        this.getGroupPost(this.indexValue, this.pageSize);
        this.cd.detectChanges();
      } else if (type === "product") {
        this.getGroupProduct(this.indexValue, this.pageSize);
        this.cd.detectChanges();
      }
    }
  }
  viewImage(image) {
    if (image) {
      let splitImage = image.split(",");
      return this.setting.getImageUrl(splitImage[0], "GetDownload");
    } else {
      return "/assets/media/placeholder/product.jpg";
    }
  }
  getUrl(product) {
    if (product.id) {
      let id = product.supplierid ? product.supplierid : product.companyId;
      let tId = product.productType;
      let url = "t" + tId + "-c" + id;
      let name = product.name?product.name
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-"):'';

      let url1 = url + "/" + name;
      url1 = url1 + "-" + product.id + ".html";
      this.productLinkUrl = ["/m/p/r/" + url1];
      return this.productLinkUrl;
    } else {
      let url =
        product.supplierName
          .replace(/[^a-zA-Z0-9_ ]/g, "")
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-") +
        "-" +
        product.supplierId +
        ".html";
      this.productLinkUrl = ["/main/m/s/" + url];
    }
    this.cd.detectChanges();
  }
  getImage(item) {
    if (item) {
      return item;
    }
  }
}
