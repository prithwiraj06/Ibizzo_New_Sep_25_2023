import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { UserProfileService } from "../../../../../provider/user-profile/user-profile.service";
import { ProductService } from "../../../../../provider/product-service/product-service.service";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../../environments/environment";
import * as _ from "underscore";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { ActivatedRoute } from "@angular/router";
import { BaseUrlPipe } from "../../../../core/_base/layout/pipes/base-url";
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";
import { PaymentjsService } from "paymentjs";


@Component({
  selector: "kt-user-profile-update",
  templateUrl: "./user-profile-update.component.html",
  styleUrls: ["./user-profile-update.component.scss"],
})
export class UserProfileUpdateComponent implements OnInit, AfterViewInit {
  @ViewChild("wizard", { static: true }) el: ElementRef;
  @Output() isMemberAdded = new EventEmitter<any>();
  @Input() token: any;
  @Input() isMember: any;
  @Input() addMemberApi: boolean = false;
  cartItemsList: any;
  loadingPincode: boolean;
  addMemberUserProfileApi: boolean = false;
  memberProfile: boolean;
  fetch: boolean = false;
  isUpdate: boolean;
  uploadDocs: FormGroup;
  pan: any = "Choose file";
  shop: any = "Choose file"
  GST: any = "Choose file";
  partnership: any = "Choose file";
  pollution: any = "Choose file";
  Aadhar: any = "Choose file";
  Quality: any = "Choose file";
  Recognition: any = "Choose file";
  exports: any = "Choose file";
  MSME: any = "Choose file";
  Factory: any = "Choose file";
  titleOfFile: any = {
    pan: 'PAN',
    shop: 'ESTABLISHMENT',
    GST: 'GST',
    partnership: 'PARTNERSHIP',
    pollution: 'POLLUTION',
    Aadhar: 'AADHAR',
    Quality: 'QUALITY',
    Recognition: 'RECONGNITION',
    exports: 'EXPORT',
    MSME: 'MSME',
    Factory: 'FACTORY'
  }
  documentions:any=[]
  isDocUpload: boolean = false;
  memberId: any;
  async save() {
    return await this.onSubmit();
  }
  keyWordsList: FormArray;
  isCheckIn = {
    videoLink1: false,
    videoLink2: false,
    facilityImage: false,
    document: false,
  };
  imageGallery: any = [
    {
      "description": '',
      "imageName": '',
      "priority": 0
    },
    {
      "description": '',
      "imageName": '',
      "priority": 1
    },
    {
      "description": '',
      "imageName": '',
      "priority": 2
    },
    {
      "description": '',
      "imageName": '',
      "priority": 3
    },
    {
      "description": '',
      "imageName": '',
      "priority": 4
    }
  ];
  isMemberDetails: boolean;
  imageName: any = "";
  public userForm: FormGroup;
  entities: any = [];
  userDetails: any = {};
  location: any;
  registerDate: any = [];
  empCount: string[];
  annualTurnOverList: { text: string; value: any }[];
  businessTypeList: { text: string; value: any }[];
  pincode: unknown;
  public facilityUploadHidden: boolean = true;
  public facilityImgHidden: boolean = false;
  urls: any = [];
  images: any =
    "../../../../../../../../assets/images/Product-Detail-No-Image.png";
  noDoc: any =
    "https://i.ya-webdesign.com/images/vector-statistics-result-6.png";
  unsbcCategory: any = [];
  isDiaPopupOpened: boolean;
  companyLogo: any;
  disabled: boolean;
  loding: boolean;
  loading: boolean;
  docUrls: any = [];
  docHidden: boolean;
  imgHidden: boolean;
  docLoding: boolean;
  logo: string = "";
  logoLoading: boolean;
  filterData: any = [];
  clicked = false;
  f: any;
  youTubeUrls: any = [];
  facilityImages: any = [];
  isUpdateDiaOpened: boolean;
  submitted: boolean;
  pincodeData: any[];
  compId: any;
  tag: any = [];
  items: any = [];
  subLoading: boolean;
  memberDetails: any;
  companyName: any;
  companyId: any;
  orgId: any;
  startStep: any;
  isId: boolean;
  isMemberProfile: boolean;
  isPending: boolean;
  addMemberProfile: boolean;
  isloading: any = {
    fragment: "website-link",
  };
  packageIsAllow:boolean

  constructor(
    private userProfile: UserProfileService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private toast: ToastrService,
    public authService: AuthService,
    private product: ProductService,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private route: Router,
    config: NgbPopoverConfig,
    private baseUrlPipe: BaseUrlPipe,
    private router: ActivatedRoute,
    private payment: PaymentjsService
  ) {
    // customize default values of popovers used by this component tree
    config.placement = "right";
    config.triggers = "hover";

    this.getRegistrationYears();
    this.empCount = [
      "1",
      "2-10",
      "11-25",
      "26-50",
      "51-100",
      "100-500",
      "500 and above",
    ];
    this.annualTurnOverList = [
      { text: "Below 10 lakhs", value: 1 },
      { text: "10 - 50 lakhs", value: 2 },
      { text: "50 lakhs - 2 crores", value: 3 },
      { text: "2 - 5 crores", value: 4 },
      { text: "5 - 20 crores", value: 5 },
      { text: "20 - 100 crores", value: 6 },
      { text: "100 - 500 crores", value: 7 },
      { text: "Above 500 crores", value: 8 },
    ];
    this.businessTypeList = [
      { text: "Exporter", value: "1" },
      { text: "Importer", value: "2" },
      { text: "Trader", value: "3" },
      { text: "Service provider", value: "4" },
      { text: "Manufacturer", value: "5" },
    ];
  }

  ngOnInit() {
    console.log("=========>", this.isMember);

    this.getMemberCart();
    this.createForm();
    this.uploadForm();

    this.activatedRoute.fragment.subscribe((fragment: string) => {
      this.isloading.fragment = fragment;
    });
    if (this.isloading.fragment == "Images") {
      this.startStep = 4;
    } else if (this.isloading.fragment == "Videos") {
      this.startStep = 4;
    } else if (this.isloading.fragment == "Logo") {
      this.startStep = 4;
    } else if (this.isloading.fragment == "Documents") {
      this.startStep = 4;
    } else if (this.isloading.fragment == "website-link") {
      this.startStep = 3;
    }
    else if (this.isloading.fragment == "minisite") {
      this.startStep = 4;
    }
    
    else if(this.isloading.fragment == "company-doc") {
      this.startStep = 7;
    }

    this.memberDetails = this.authService.getCurrentUser();
    this.companyName = this.memberDetails.companyName;
    this.companyId = this.memberDetails.id;
    this.orgId = this.memberDetails.organizationId;
    this.userProfile.getEntity().then((res: any) => {
      this.entities = res.entities;
    });
    if (this.token) {
      this.getProfile();
    }
    this.router.queryParams.subscribe((params) => {
      console.log("isMember", this.token);
      if (params) {
        console.log("params", params);
        this.isMemberProfile = params.isMember == "false" ? true : false;
        this.isUpdate = true;
      }
    });
    this.router.params.subscribe((param) => {
      if (param.id) {
        this.isId = true;
        this.memberId=param.id
        this.cd.detectChanges()
      }
    });
    console.log("user profile", this.isId, this.isMemberProfile);

    this.isPending = this.isId && this.isMemberProfile ? false : true;
    if (localStorage.getItem('MEMBER_PROFILE_' + this.token)) {
      this.addMemberProfile = true;
    }
  }

  stepChange(){
    console.log("changes");
    this.packageIsAllow=true;
    
  }

  ngAfterViewInit() {
    // Initialize form wizard
    const wizard = new KTWizard(this.el.nativeElement, {
      startStep: this.startStep,
    });

    if (this.isloading.fragment) {
      var ele = document.getElementById(this.isloading.fragment);
      ele.scrollIntoView({ behavior: "smooth" });
    }
  }
 

  config: any = {
    height: 200,
    theme: "modern",
    // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
    plugins:
      "print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern",
    toolbar:
      "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat",
    image_advtab: true,
    menubar: false,
    imagetools_toolbar:
      "rotateleft rotateright | flipv fliph | editimage imageoptions",
    templates: [
      { title: "Test template 1", content: "Test 1" },
      { title: "Test template 2", content: "Test 2" },
    ],
    content_css: [
      "//fonts.googleapis.com/css?family=Lato:300,300i,400,400i",
      "//www.tinymce.com/css/codepen.min.css",
    ],
  };

  async getProfile() {
    if (this.isMember) {
      this.fetch = true;
      this.getMemberDetailsAndPatch(this.token);
    } else {
      this.userProfile.getProfile(this.token).then((res: any) => {
        if (res.userDetails) {
          this.userDetails = res.userDetails;
          this.patchValue();
          if (
            this.userDetails.companyVideos.length > 0 &&
            this.userDetails.companyVideos[0].videoUrl != null
          ) {
            let vid = this.userDetails.companyVideos[0].videoUrl.split(",");
            if (vid.length == 2) {
              this.userForm.controls.videoLink1.setValue(vid[0]);
              this.userForm.controls.videoLink2.setValue(vid[1]);
            } else {
              this.userForm.controls.videoLink1.setValue(vid[vid.length - 1]);
            }
          }
          this.getFacilityImage();
          this.getDocuments();
        }
      });
    }
  }
  memberEvent(event: any) {
    this.addMemberApi = event.memberAdded;
    if (event.memberAdded == undefined) {
      this.addMemberApi = false;
    }
  }
  //member data fetch
  async getMemberDetailsAndPatch(id) {
    this.isMemberDetails = true;
    let data = JSON.parse(localStorage.getItem("MEMBER_PROFILE_" + this.token));
    debugger
    if (data) {
      this.userForm.patchValue(data);
      this.userForm.controls.phoneNumber.setValue(data.phoneNo)
      this.userForm.controls.location.setValue(data.companyPincode||data.pinCode)
      this.onChangePincode('')
    }
    if (id) {
      try {
        let res: any = await this.userProfile.getProfileDataOfMember(id);
        if (res.userDetails) {
          this.userDetails = res.userDetails;
          if (Object.keys(this.userDetails).length > 0) {
            this.patchMemberCompanyVideos();
            this.patchMemberCompanyDocuments();
            this.patchMemberCompanyImages();
            this.patchValue();
          }
          this.cd.detectChanges();
        }
      } catch (e) { }
    }
  }

  //FORMAT: Member company Videos
  patchMemberCompanyVideos() {
    let data = {};
    data["videoLink1"] =
      (this.userDetails.companyVideos[0] &&
        this.userDetails.companyVideos[0].videoUrl) ||
      "";
    data["videoLink2"] =
      (this.userDetails.companyVideos[1] &&
        this.userDetails.companyVideos[1].videoUrl) ||
      "";
    this.userForm.patchValue(data);
  }

  //FORMAT: Member company documents
  patchMemberCompanyDocuments() {
    if (this.userDetails.companyDocuments.length > 0) {
      _.each(this.userDetails.companyDocuments, (key) => {
        if (key.documentName) {
          this.docUrls.push(key.documentName);
        }
      });
    }
  }

  //FORMAT: Member company Images
  patchMemberCompanyImages() {
    _.each(this.userDetails.companyImages, (item) => {
      if (item.imageName) {
        this.urls.push(this.userProfile.downloadImage(item.imageName));
        this.facilityImages.push(item.imageName);
      }
    });
    if (this.urls.length > 0) {
      this.images = this.urls[0];
    }
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  patchValue() {
    this.compId = this.userDetails.companyId;
    this.location = this.userDetails.companyPincode||this.userDetails.location;
    this.userForm.patchValue(this.userDetails);
    this.userForm.controls.location.setValue(this.location);
    this.userForm.controls.bussinessType.setValue(this.userDetails.bussinessType.toString());

    this.userForm.controls.address.setValue(this.userDetails.companyAddress||this.userDetails.address);

    if (this.userDetails.keywords) {
      this.handleFormArray('keyWordsList',this.userDetails.keywords) 
    }
   
    if (this.userDetails.logo != null && this.userDetails.logo != "") {
      this.logo = this.userProfile.downloadImage(this.userDetails.logo);
    }
    this.userForm.controls.companyLogo.setValue(this.userDetails.logo);
    // [ this.userDetails.natuteOfBusiness[ 0 ].name ];
    if (this.userDetails.natuteOfBusiness.length > 0) {
      this.unsbcCategory = this.userDetails.natuteOfBusiness;
      console.log(this.userDetails.natuteOfBusiness, this.unsbcCategory);
      this.fetch = true;
      _.each(this.userDetails.natuteOfBusiness, (item: any) => {
        let value = { display: item.name, value: item.name };
        this.tag.push(value);
      });
    }

    if (this.userDetails && this.userDetails.verifiedDocument) {
      _.each(this.userDetails.verifiedDocument, (item) => {
       let key= item.docType
        let name = this.getKeyByValue(this.titleOfFile, key);
        console.log("name", name);
        if (name && item.docName) {
          let label_ = item.docName.includes('#~#') ? item.docName.split('#~#')[1] : item.docName;
          this.uploadDocs.controls[name].setValue(label_)
          // this.isDocUpload = false;
          this[name]=label_
           if (name && this.titleOfFile[name]) {
             let options = {
               "docName": item.docName,
                "docType": this.titleOfFile[name]
             }
             let index = _.findIndex(this.documentions, { docType: this.titleOfFile[name] });
             if (index != -1) {
               this.documentions[index].docName = item.docName;
             }
             else {
               this.documentions.push(options)
             }
           }
        }
        
    })
      
    }

    this.fetch = true;
    this.onChangePincode("");
    this.cd.detectChanges();
  }

  getRegistrationYears() {
    for (let i = 1900; i <= moment().year(); i++) {
      this.registerDate.push(i.toString());
    }
  }

  getFacilityImage() {
    if (
      this.userDetails.companyImages.length > 0 &&
      this.userDetails.companyImages[0].imageName != null
    ) {
      let imageDetails = this.userDetails.companyImages[0].imageName.split(",");
      _.each(imageDetails, (item) => {
        if (this.urls.length < 3) {
          this.urls.push(this.userProfile.downloadImage(item));
          this.facilityImages.push(item);
          this.images = this.urls[0];
        } else {
          return;
        }
      });
    }
  }

  getDocuments() {
    if (
      this.userDetails.companyDocuments.length > 0 &&
      this.userDetails.companyDocuments[0].documentName != null
    ) {
      let documents = this.userDetails.companyDocuments[0].documentName.split(
        ","
      );
      console.log(documents);
      if (documents.length > 1) {
        _.each(documents, (item) => {
          this.docUrls.push(encodeURIComponent(item));
        });
      } else {
        this.docUrls.push(encodeURIComponent(documents[0]));
      }
    }
  }

  onTextChange(text: any) {
    return this.product.getProductDetails(text).then((res: any) => {
      if (res.suggestedCategorie != null) {
        this.items = res;
      } else {
        // this.toast.error("No record found from search list")
        this.items = [];
      }
    });
  }

  onBusinessCategoryChange(data: any) {
    //   this.unsbcCategory = data;
    //   console.log(this.unsbcCategory);

    // }

    // onTagsChanged(event) {
    //   if (event.change == "add") {
    //     this.unsbcCategory.push({ unsbcCode: 0, name: event.tag.name });
    //   } else {
    //     let index = _.findIndex(this.unsbcCategory, { "name": event.tag.name });
    //     if (index > -1) {
    //       this.unsbcCategory.splice(index, 1);
    //     }
    //   }
    //   // this.categoryError = this.unsbcCategory.length > 0 ? false : true;

    // }

    this.unsbcCategory = data;
  }

  createForm() {
    this.userForm = this.fb.group({
      name: ["", Validators.required],
      designation: [""],
      entity: [""],
      gstin: [""],
      country: [""],
      state: [""],
      city: [""],
      pinCode: [""],
      phoneNumber: "", //[ '', [ Validators.required ] ],
      address: [""],
      email: ["", [Validators.required, Validators.email]],
      productName: [""],
      location: [""],
      socialOrganizationName: [null],
      companyName: ["", Validators.required],
      website: ["", Validators.pattern("https?://.+")],
      companyLogo: [""],
      natuteOfBusiness: [],
      registrationDate: [null],
      employeeCount: [null],
      bussinessType: [""],
      annualTurnover: [""],
      aboutYourCompany: [""],
      officename: [null],
      divisionname: [""],
      regionname: [""],
      circlename: [""],
      companyFacilityImages: [""],
      docUpload: [""],
      videoLink1: [
        "",
        Validators.pattern(
          /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/
        ),
      ],
      videoLink2: [
        "",
        Validators.pattern(
          /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/
        ),
      ],
      pincodeData: [""],
      businessCategory: [""],
      profile: [""],
      accentColor: [""],
      alternateColor: [""],
      keyWordsList: this.fb.array([this.createForm1()]),
    });
  }

  uploadForm() {
    this.uploadDocs = this.fb.group({
      pan: [""],
      shop: [""],
      GST: [""],
      partnership: [""],
      pollution: [""],
      Aadhar: [""],
      Quality:[""],
      Recognition: [""],
      MSME: [""],
      exports: [""],
      Factory:[""]
      
    })
  }

  formObjectToArray(list) {
    let array: any = [];
    if (list) {
      list.forEach((key) => {
        if (key.value) {
          array.push(key.value);
        }
      });
    }
    return array;
  }

  hasControl(controlName: string) {
    return this.userForm.controls[controlName];
  }

    //for incresing fields of keyword and description
  handleFormArray(key, list) {
    let keyWords=list.split(',')
      let formArray = this.userForm.controls[key] as FormArray;
  
      formArray.removeAt(0);
      _.each(keyWords, (key) => {
        if (key) {
          formArray.push(this.createForm1(key));
        }
      });
    }

    //handle description and keyword case
    addCell(key) {
      let feildName = this.userForm.get(key) as FormArray;
      feildName.push(this.createForm1());
      this.keyWordsList = feildName;
    }
  
    //dynamic create form
    createForm1(value?: any) {
      return this.fb.group({
        value: value || "",
      });
    }
  
  getImage(image) {
    this.userProfile.uploadDocument(image).then((res) => {
      return res;
    });
  }

  public compLogo;
  detectFiles(event: any) {
    this.logoLoading = true;
    let checkImage = false;
    let files = event.target.files;
    let checkFileTypeValid = false;
    let checkFileSizeVaild = false;
    let reader = new FileReader();
    let canUpload = true;
    if (files) {
      for (let file of files) {
        if (
          file.name.indexOf("jpg") >= 0 ||
          file.name.indexOf("png") >= 0 ||
          file.name.indexOf("jpeg") >= 0 ||
          file.name.indexOf("jpeg") >= 0
        ) {
          checkFileTypeValid = true;
        } else {
          // alert("Please Upload image of type .jpg, .png.");
          this.isDiaPopupOpened = true;
          this.logoLoading = false;
          this.toast.error("Please Upload image of type .jpg, .png, .jpeg");
          if (!checkImage) this.imageName = "";
          canUpload = false;
          this.userForm.controls.companyLogo.setValue("");
          checkFileTypeValid = false;
          break;
        }
        // if (file.size < 300000) {
        //   checkFileSizeVaild = true;
        // } else {
        //   //alert("Please Upload image Size less than 200 kB.")
        //   this.isDiaPopupOpened = true;
        //   this.toast.error("Please Upload image Size less than 300 kB.");
        //   this.logoLoading = false;
        //   if (!checkImage) this.imageName = "";
        //   this.userForm.controls.companyLogo.setValue("");
        //   canUpload = false;
        //   checkFileSizeVaild = false;
        //   break;
        // }
      }

      if (canUpload) {
        if (checkFileTypeValid) {
          reader.onload = (e: any) => { };
          reader.readAsDataURL(files[0]);
        }
        for (let file of files) {
          this.userProfile.uploadImage(file).then((res) => {
            this.logo = this.userProfile.downloadImage(res);
            this.logoLoading = false;
            this.userForm.controls.companyLogo.setValue(res);
            this.disabled = true;
            this.cd.detectChanges();
          });
        }
      }
    }
  }

  docUpload(event: any,name) {
    this.isDocUpload = true;
    let checkImage = false;
    let files = event.target.files;
    let checkFileTypeValid = false;
    let checkFileSizeVaild = false;
    let reader = new FileReader();
    let canUpload = true;
    if (files) {
      // for (let file of files) {
      //   if (
      //     file.name.indexOf("jpg") >= 0 ||
      //     file.name.indexOf("png") >= 0 ||
      //     file.name.indexOf("jpeg") >= 0 ||
      //     file.name.indexOf("jpeg") >= 0||
      //     file.name.indexOf("pdf")
      //   ) {
      //     checkFileTypeValid = true;
      //   } else {
      //     // alert("Please Upload image of type .jpg, .png.");
      //     this.isDiaPopupOpened = true;
      //     this.logoLoading = false;
      //     this.toast.error("Please Upload image of type .jpg, .png, .jpeg");
      //     if (!checkImage) this.imageName = "";
      //     canUpload = false;
      //     // this.userForm.controls.companyLogo.setValue("");
      //     checkFileTypeValid = false;
      //     break;
      //   }
      // }

      if (canUpload) {
        if (checkFileTypeValid) {
          reader.onload = (e: any) => { };
          reader.readAsDataURL(files[0]);
        }
        for (let file of files) {
          this.userProfile.uploadDoc(file).then((res) => {
            console.log(file);
            this[name] = file.name;
            this.uploadDocs.controls[name].setValue(res)
           this.isDocUpload = false;
            if (name && this.titleOfFile[name]) {
              let options = {
                "docName": res,
                 "docType": this.titleOfFile[name]
              }
              debugger
              let index = _.findIndex(this.documentions, { docType: this.titleOfFile[name] });
              if (index != -1) {
                this.documentions[index].docName = res;
              }
              else {
                this.documentions.push(options)
              }
            }
            console.log('this.documentions',this.documentions);
            
            // this.logo = this.userProfile.downloadDoc(res);
            // console.log("res",this.logo)
            // this.disabled = true;
            this.cd.detectChanges();
          });
        }
      }
    }
  }

  isCheckControls(name: any, type: any) {
    const control = this.userForm.controls[name];
    const result = control.hasError(type) && (control.dirty || control.touched);
    return result;
  }

  updateProfile = false;
  uploadFacilityImages(event: any) {
    this.isCheckIn.facilityImage = true;
    this.loading = true;
    let checkImage = false;
    for (let i = 0; i < this.urls.length; i++) {
      if (
        this.urls[i] !=
        "../../../../../../../../assets/images/Product-Detail-No-Image.png"
      ) {
        checkImage = true;
        break;
      }
    }

    // if (!checkImage) {
    //   this.urls = [];
    // }

    if (this.urls.length < 3) {
      let companyFacilityImgs = event.target.files;
      let canUpload = true;
      if (companyFacilityImgs) {
        for (let facilityImg of companyFacilityImgs) {
          let checkFileTypeValid = false;
          let checkFileSizeVaild = false;
          let reader = new FileReader();
          if (
            facilityImg.name.indexOf("jpg") >= 0 ||
            facilityImg.name.indexOf("png") >= 0 ||
            facilityImg.name.indexOf("gif") >= 0 ||
            facilityImg.name.indexOf("jpeg") >= 0
          ) {
            checkFileTypeValid = true;
          } else {
            this.loading = false;
            this.toast.error("Please Upload image of type .jpg, .png, .jpeg");
            if (!checkImage)
              // this.urls.push(this.images);
              this.loading = false;
            canUpload = false;
            checkFileTypeValid = false;
            break;
          }
          if (facilityImg.size <= 2100000) {
            checkFileSizeVaild = true;
          } else {
            this.loading = false;
            this.isDiaPopupOpened = true;
            this.toast.error("Please Upload image Size less than 2MB.");
            if (!checkImage)
              // this.urls.push(this.images);
              this.loading = false;
            canUpload = false;
            checkFileSizeVaild = false;
            break;
          }
          if (checkFileTypeValid && checkFileSizeVaild) {
            reader.onload = (e: any) => {
              //this.urls.push(e.target.result);
            };
            //if(this.urls)
            reader.readAsDataURL(facilityImg);
          }
        }

        if (canUpload) {
          if (!this.updateProfile) {
            for (let facilityImg of companyFacilityImgs) {
              this.userProfile
                .uploadImage(facilityImg)
                .then((res: any) => {
                  this.imageName = this.userProfile.getImageUrl(res);
                  if (this.urls.length < 3) {
                    this.facilityImages.push(res);
                    this.urls.push(this.imageName);

                    this.images = this.urls[0];
                  } else {
                    this.isDiaPopupOpened = true;
                    this.toast.error("Maximum Three images can be uploaded.");
                    return;
                  }
                  this.loading = false;
                  this.cd.detectChanges();
                })
                .catch((err) => {
                  this.toast.error("Fail to uploaded Image.");
                  this.loading = false;
                });
            }
          }
        }
      }
    } else {
      this.isDiaPopupOpened = true;
      this.toast.error("Maximum Three images can be uploaded.");
      this.loading = false;
    }
  }

  onChangePincode(event) {
    debugger
    this.loadingPincode = true;
    this.cd.detectChanges();
    if (
      this.userForm.controls.location.value != "" &&
      this.userForm.controls.location.value != null &&
      this.userForm.controls.location.value.length == 6
    ) {
      this.userProfile
        .getArea(this.userForm.controls.location.value)
        .then((res: any) => {
          this.loadingPincode = false;
          this.cd.detectChanges();
          if (res.pincodeInfo.length != 0) {
            this.userForm.patchValue(res.pincodeInfo[0]);
            this.userForm.controls.state.setValue(res.pincodeInfo[0].statename);
            this.pincodeData = [];
            if (res.pincodeInfo.length != 0) {
              _.each(res.pincodeInfo, (item, i) => {
                if (
                  res.pincodeInfo[i].officename != "" &&
                  res.pincodeInfo[i].officename != null &&
                  res.pincodeInfo[0].officename != undefined
                ) {
                  this.pincodeData.push(item.officename);
                }
              });
            }
          } else {
            this.resetPincodeForm();
          }
        });
    } else {
      this.resetPincodeForm();
    }
  }

  resetPincodeForm() {
    this.loadingPincode = false;
    this.userForm.controls.officename.setValue(null);
    this.userForm.controls.divisionname.setValue("");
    this.userForm.controls.regionname.setValue("");
    this.userForm.controls.circlename.setValue("");
    this.userForm.controls.state.setValue("");
    this.pincodeData = [];
    this.cd.detectChanges();
  }

  uploadDocuments(event: any) {
    this.isCheckIn.document = true;
    let chkDoc = false;

    if (this.docUrls.length < 2) {
      this.docLoding = true;
      let docFiles = event.target.files;
      let canUpload = true;
      if (docFiles) {
        for (let docFile of docFiles) {
          let checkDocFileTypeValid = false;
          let checkDocFileSizeValid = false;
          let docReader = new FileReader();
          if (docFile.name.indexOf("pdf") >= 0) {
            checkDocFileTypeValid = true;
          } else {
            this.isDiaPopupOpened = true;
            this.toast.error("Please Upload file of type .pdf.");
            this.docLoding = false;
            if (!chkDoc) canUpload = false;
            checkDocFileTypeValid = false;
            break;
          }

          if (docFile.size <= 5000000) {
            checkDocFileSizeValid = true;
          } else {
            this.isDiaPopupOpened = true;
            this.toast.error("Please Upload image Size less than 5 MB");
            this.docLoding = false;
            if (!chkDoc) canUpload = false;
            checkDocFileTypeValid = false;
            break;
          }
        }

        if (canUpload) {
          let self = this;
          for (let docFile of docFiles) {
            this.userProfile
              .uploadDocument(docFile)
              .then((res) => {
                if (this.docUrls.length < 2) {
                  let item: any = res;
                  if (item) {
                    let array = encodeURIComponent(item);
                    this.docUrls.push(array);
                  } else {
                    this.docUrls.push(res);
                  }
                  this.docLoding = false;
                  this.cd.detectChanges();
                } else {
                  this.toast.error("Maximum two docs can be uploaded");
                  this.docLoding = false;
                  this.cd.detectChanges();
                  return;
                }
                this.docHidden = false;
                this.imgHidden = true;
              })
              .catch((err: any) => {
                this.docLoding = false;
                this.cd.detectChanges();
                this.toast.error("Upload Failed: Document is too large");
              });
          }
        }
      } else {
        this.isDiaPopupOpened = true;
        this.toast.error("Maximum two docs can be uploaded");
        if (this.docUrls.length == 0) {
          this.docUrls = [
            "assets/Images/add_icon.png",
            "assets/Images/add_icon.png",
          ];
        }
      }
    } else {
      this.toast.error("Maximum two docs can be uploaded");
      this.docLoding = false;
      this.cd.detectChanges();
      return;
    }
  }

  deleteDoc(index) {
    this.isCheckIn.document = true;
    this.docUrls.splice(index, 1);
    this.cd.detectChanges();
  }

  deleteImage(image: any, index: any) {
    this.isCheckIn.facilityImage = true;
    this.urls.splice(index, 1);
    this.facilityImages.splice(index, 1);

    let data = _.findIndex(this.urls, image);
    if (data == -1 && this.urls.length != 0) {
      this.images = this.urls[0];
    }
    if (this.urls.length == 0) {
      this.images =
        "../../../../../../../../assets/images/Product-Detail-No-Image.png";
    }
    this.userForm.controls.companyFacilityImages.reset();
  }

  getRoute(doc: any) {
    return (
      environment.API_URL +
      "Upload/GetCompanyDocumentDownload?filename=" +
      doc
    );
  }
  getDocName(doc: any) {
    let file = doc.includes("%23~%23") ? doc.split("%23~%23")[1] : doc;
    return file.includes("%20") ? file.replace(/%20/g, " ") : file;
  }

  setImage(data: any) {
    this.images = data;
    this.cd.detectChanges();
  }

  close() {
    this.logo = "";
    this.userForm.controls.companyLogo.setValue("");
    this.userForm.controls.profile.reset();
    this.cd.detectChanges();
  }

  async onSubmit() {
    return new Promise((resolve, rejects) => {
      let listOfArray = [];
      this.f = this.userForm.controls;
      if (this.userForm.invalid) {
        Object.keys(this.f).forEach((key) => {
          this.f[key].markAllAsTouched();
        });
        if (this.userForm.controls["website"].status == "INVALID") {
          this.toast.error("Website link is invalid");
          return;
        }
        this.toast.error("Please fill the required fields");
        return;
      }
      if (this.f.videoLink1.value != "") {
        this.youTubeUrls.push(this.f.videoLink1.value);
      }
      this.subLoading = true;
      if (this.f.videoLink2.value != "") {
        this.youTubeUrls.push(this.f.videoLink2.value);
      }
      let wbs = this.f.website.value;
      if (wbs === null || wbs === "") {
        wbs = null;
      }
      if (this.tag.length != 0) {
        _.each(this.tag, (item, i) => {
          let value = { unsbcCode: i, name: item.value };
          listOfArray.push(value);
        });
      }

      let companyId = this.compId;
      let id = this.token;

      let userRequest = {
        socialOrganizationId: 0,
        name: this.f.name.value,
        designation: this.f.designation.value,
        entity: this.f.entity.value,
        gstin: this.f.gstin.value,
        country: this.f.country.value,
        state: this.f.state.value,
        city: this.f.city.value,
        pincode: this.f.location.value,
        phoneNumber: this.f.phoneNumber.value,
        address: this.f.address.value,
        email: this.f.email.value,
        productName: this.f.productName.value,
        location: this.f.location.value,
        socialOrganizationName: this.f.socialOrganizationName.value,
        companyName: this.f.companyName.value,
        website: wbs,
        natuteOfBusiness: this.unsbcCategory,
        registrationDate: this.f.registrationDate.value,
        employeeCount: this.f.employeeCount.value,
        annualTurnover: parseInt(this.f.annualTurnover.value) || 0,
        aboutYourCompany: this.f.aboutYourCompany.value,
        circlename: this.f.circlename.value || "",
        officeName: this.f.officename.value || "",
        regionName: this.f.regionname.value || "",
        divisionName: this.f.divisionname.value || "",
        logo: this.f.companyLogo.value,
        accentColor: this.f.accentColor.value || "",
        alternateColor: this.f.alternateColor.value || "",
        keywords:this.formObjectToArray(this.userForm.value.keyWordsList)
      };
      debugger
      if (this.isMember) {
        this.uploadMemberDetails(userRequest);
      } else {
        userRequest["id"] = id;
        userRequest["companyId"] = parseInt(companyId);
        userRequest["locationType"] = "1";
        userRequest["bussinessType"] = this.f.bussinessType.value;

        this.userProfile
          .updateProfile(userRequest)
          .then(async (Prof: any) => {
            if (Prof.isUpdate) {
              !this.isUpdate ? this.updateLocalStorageProfileData() : "";
              debugger;
              if (this.isCheckIn.facilityImage) {
                let cfdata = {
                  Token: id,
                  CompanyId: companyId,
                  ImageNames: this.facilityImages,
                };
                let facility: any = await this.userProfile.uploadFacilityImages(
                  cfdata
                );
                try {
                  if (facility) {
                    if (facility.isCompanyImageAdded) {
                      this.submitted = false;
                    } else {
                      this.submitted = false;
                    }
                  }
                } catch {
                  this.submitted = false;
                }
              }
              if (this.isCheckIn.document) {
                let uploadData = {
                  Token: id,
                  CompanyId: companyId,
                  DocName: this.docUrls.length > 0 ? this.docUrls : [],
                };
                let doc: any = this.userProfile.uploadCompanyDocuments(
                  uploadData
                );
                try {
                  if (doc) {
                    if (doc.isCompanyImageAdded) {
                      this.submitted = false;
                    } else {
                      this.submitted = false;
                    }
                  }
                } catch {
                  this.submitted = false;
                }
              }
              if (
                this.userForm.controls.videoLink1.touched ||
                this.userForm.controls.videoLink2.touched
              ) {
                let uploadVideos = {
                  Token: id,
                  CompanyId: companyId,
                  Videos: this.youTubeUrls,
                };
                let url: any = this.userProfile.uploadCompanyVideos(
                  uploadVideos
                );
                try {
                  if (url) {
                    if (url.isCompanyImageAdded) {
                      this.submitted = false;
                    } else {
                      this.submitted = false;
                    }
                    debugger
                    if (this.isMemberProfile) {
                      if (this.userDetails.verifiedDocument && this.userDetails.verifiedDocument.length != 0) {
                      this.updatePackageOfDoc();
                      }
                      else {
                      this.addWithoutPayment(true)
                      }
                    }
                    else {
                      let result: any = await this.userProfile.getOffersDetails(this.userDetails.id, 3)
                      if (this.documentions.length != 0 && !result.offerPurcahsed) {
                        this.alertDocument()
                        await this.getMemberCart();
                      }
                      else if (this.documentions.length != 0 && result.offerPurcahsed) {
                        this.updatePackageOfDoc();
                        await this.getMemberCart();
                      }
                      else if (this.documentions.length != 0 && result.offerPurcahsed) {
                        if (this.userDetails.isVerified == 'Verified') {
                          this.sweetAlert();
                          await this.getMemberCart();
                        }
                        else {
                          this.alertDocument()
                          await this.getMemberCart();
                        }
                      }
                      else {
                        this.sweetAlert();
                        await this.getMemberCart();
                      }
                    }
                  }
                } catch {
                  this.submitted = false;
                  this.sweetAlert();
                }
              } else {
                if (this.isMemberProfile) {
                  if (this.userDetails.verifiedDocument && this.userDetails.verifiedDocument.length != 0) {
                  this.updatePackageOfDoc();
                  }
                  else {
                  this.addWithoutPayment(true)
                  }
                }
                else {
                  let result:any=await this.userProfile.getOffersDetails(this.userDetails.id,3)
                  if (this.documentions.length != 0&&!result.offerPurcahsed) {
                    this.alertDocument()
                    await this.getMemberCart();
                  }
                  else if (this.documentions.length != 0&&result.offerPurcahsed) {
                    this.updatePackageOfDoc();
                    await this.getMemberCart();
                  }
                  else if (this.documentions.length != 0&&result.offerPurcahsed) {
                    if (this.userDetails.isVerified == 'Verified') {
                      this.sweetAlert();
                      await this.getMemberCart();
                    }
                    else {
                      this.alertDocument()
                      await this.getMemberCart();
                    }
                  }
                  else {
                    this.sweetAlert();
                    await this.getMemberCart();
                  }
                }
            
              }
            }
            resolve(true);
            localStorage.removeItem('MEMBER_PROFILE_' + this.token);
            this.subLoading = false;
          })
          .catch((err: any) => {
            rejects(false);
            this.subLoading = false;
            console.log(err);
          });
      }
    });
  }

  alertDocument() {
    Swal.fire({
      title: "Verified Company Documents Need to be Purchase the Verified Package!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result && result.value) {
        this.subScription();
      }
      else {
        if (this.userDetails.verifiedDocument && this.userDetails.verifiedDocument.length != 0) {
          this.updatePackageOfDoc()
        }
        else {
          this.addWithoutPayment()
        }
      }
    });
  }

  async addWithoutPayment(isMember?:any) {
    const currentUser: any = this.authService.getCurrentUser();

    let finalPackage: any = {
      "memberId":isMember?this.userDetails.id: currentUser.id,
      "docDetails": this.documentions,
     "offerId": 3,
      "appSecretKeyPassed":null,
     "referenceId": null,
      "transationDetails":null
    };
    let res: any = await this.userProfile.addPackages(finalPackage);
    console.log("add membepackge details no error============>", res);
    if (res && res.message == "success") {
      this.toast.success("Document Added successfully");
      this.sweetAlert()
    } else {
      if (res && res.message == "Offer has been already purchased") {
        this.toast.success("Offer has been already purchased");
      } else {
        if(res&&res.message){
          this.toast.success(res.message);
        }
        else{
          this.toast.error("Documents Uploading is Failed");

        }
      }
      this.sweetAlert()
    }
  }

  async updatePackageOfDoc(finalDoc?:any) {
    let oldNew = []
    let newDocUp=[]
    _.each(this.documentions, (doc) => {
      let option = {
          "oldDocName": doc.docName,
          "newDocName": "",
           "docType": doc.docType
      }
      oldNew.push(option)
    })
    const currentUser: any = this.authService.getCurrentUser();
    _.each(this.userDetails.verifiedDocument, (item) => {
      _.each(oldNew, (doc) => {
        if (doc.oldDocName != item.docName&&doc.docType==item.docType) {
          doc.newDocName =doc.oldDocName
          doc.oldDocName = item.docName
          newDocUp.push(doc)
          return
        }
      })
     
    })

    _.each(this.userDetails.verifiedDocument, (item) => {
      _.each(oldNew, (doc,index) => {
        if (doc.docType == item.docType) {
          let index1 = _.findIndex(this.documentions, { docType: item.docType })
          if (index1 != -1) {
            this.documentions.splice(index1, 1);
            return
          }
        }
      })
    })

    _.each(this.documentions, (item) => {
      let option = {
        "oldDocName": "",
        "newDocName": item.docName,
         "docType": item.docType
      }
      newDocUp.push(option);
    })
    

    console.log(newDocUp,this.documentions);

    let finalPackage: any = {
      "memberId":this.isMemberProfile?this.userDetails.id: currentUser.id,
      "docDetails": newDocUp,
     "offerId": 3,
      "appSecretKeyPassed":environment.RAZORPAY_PUBLIC_KEY,
     "referenceId": null,
      "transationDetails":null
    };
    if (finalDoc) {
      finalDoc.docDetails = newDocUp
      finalPackage=finalDoc
    }
    

    console.log("paymentdata", finalPackage);
    let res: any = await this.userProfile.updatePackages(finalPackage);
    console.log("add membepackge details no error============>", res);
    if (res && res.message == "success") {
      this.toast.success("Updated successfully");
     this.sweetAlert()
    } else {
      if (res && res.message == "Offer has been already purchased") {
        this.toast.success("Offer has been already purchased");
      } else {
        if(res&&res.message){
          this.toast.success(res.message);
        }
        else{
          this.toast.error("Documents Uploading is Failed");


        }
      }
     this.sweetAlert()
    }
  }

  updateLocalStorageProfileData() {
    let profileData = {
      isAuthenticated: true,
      token: this.userDetails.id.toString(),
      jwtToken: this.authService.getJwtToken(),
      memberUserInfo: {
        companyId: this.memberDetails.companyId,
        companyName: this.f.companyName.value,
        email: this.memberDetails.email,
        id: this.memberDetails.id,
        isAgreedForTandC: this.memberDetails.isAgreedForTandC,
        location: this.f.location.value,
        locationType: this.memberDetails.locationType,
        name: this.f.name.value,
        organizationId: this.memberDetails.organizationId,
        organizationName: this.memberDetails.organizationName,
        paymentEnabled: this.memberDetails.paymentEnabled,
        phoneNumber: this.f.phoneNumber.value,
        roles: this.memberDetails.roles,
        uniqueId: this.memberDetails.uniqueId,
        partnerInfo: this.memberDetails.partnerInfo,
      },
    };
    localStorage.setItem("memberData", JSON.stringify(profileData));
    this.product.broadcastEvent("UPDATED_INFO", null);
  }

  sweetAlert() {
    Swal.fire({
      title: "Saved Successfully!",
      icon: "success",
    }).then(() => {
      this.product.broadcastEvent("CART_UPDATED", null);
      if (window.location.href.includes("member-profile")) {
        // this.product.broadcastEvent('MEM_CART_UPDATED', null);
        this.memberProfile = true;
      }
      if (!this.memberProfile) {
        if (this.cartItemsList.length > 0) {
          this.route.navigateByUrl(
            this.baseUrlPipe.transform(["/dashboard/business/cart-details"])
          );
        } else {
          this.route.navigateByUrl(
            this.baseUrlPipe.transform(["/dashboard/business/home"])
          );
        }
      } else {
        this.subLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  public onColorChange(event: string, data: any): void {
    let value = {};
    value[event] = data.color;
    this.userForm.patchValue(value);
  }

  invertColor(hex: string) {
    if (hex) {
      if (hex.indexOf("#") === 0) {
        hex = hex.slice(1);
      }
      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length !== 6) {
        return "#000000";
        // throw new Error('Invalid HEX color.');
      }
      // invert color components
      var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
      // pad each with zeros and return
      return "#" + this.padZero(r) + this.padZero(g) + this.padZero(b);
    }
  }

  padZero(str: string, len?: number) {
    len = len || 2;
    var zeros = new Array(len).join("0");
    return (zeros + str).slice(-len);
  }

  //UPDATE: Member-profile
  async uploadMemberDetails(userRequest) {
    let res: any;
    let companyId = this.userDetails.companyId;
    userRequest["id"] = parseInt(this.token);
    userRequest["companyId"] = this.userDetails.companyId;
    userRequest["locationType"] = 1;
    userRequest["bussinessType"] =
      this.f.bussinessType.value && this.f.bussinessType.value.toString();

    try {
      //profile data
      if (!this.isMemberDetails && this.addMemberApi) {
        res = await this.userProfile.addMemberProfile(userRequest);
        localStorage.removeItem("MEMBER_PROFILE_" + this.token);
        // companyId = res.companyId;
        this.isMemberAdded.emit({ memberAdded: false, profile: userRequest });
      } else {
        res = await this.userProfile.updateMemberProfile(userRequest);
        this.isMemberAdded.emit({ profile: userRequest });
      }

      if (res.isProfileUpdated || res.isProfileAdded) {
        //Upload: Images
        await this.userProfile.updateMemberProfileImages(
          this.facilityImages,
          this.token,
          companyId
        );

        //Upload: Documents
        await this.userProfile.updateMemberProfileDocuments(
          this.docUrls,
          this.token,
          companyId
        );

        //Upload: Youtube videos
        await this.userProfile.updateMemberProfileVideos(
          this.youTubeUrls,
          this.token,
          companyId
        );

        this.subLoading = false;
        this.cd.detectChanges();
        this.toast.success("Profile Updated Successfuly");
      } else {
        this.subLoading = false;
        this.cd.detectChanges();
        this.toast.error("Profile Updated Failed");
      }
    } catch (e) {
      this.subLoading = false;
      this.cd.detectChanges();
      this.toast.error("Profile Updated Failed");
    }
  }

  async subScription() {
    const currentUser: any = this.authService.getCurrentUser();
    if (currentUser && currentUser.email) {
      let reciept = `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;
      let orderDetails: any = {
        email: currentUser.email,
        phonenumber: currentUser.phoneNumber,
        amount: 999,
        receipt: reciept,
        currency: "INR",
        payment_capture: 1,
        username: environment.RAZORPAY_PUBLIC_KEY,
      };

      try {
        // let res: any = await this.digital.addMemberCartSnapshot(addCardSnap);
        // if (res) {
        orderDetails.description = "123" + "#~#CART" || "";
        event.preventDefault();
        const response: any = await this.payment.checkout({
          paymentInstrument: "payment_razorpay",
          params: orderDetails,
        });
        console.log("Respose", response);

        this.paymentResponseHander(response,reciept);
        // }
        // this.processingPayment = false;
      } catch (e) {
        // this.processingPayment = false;
        this.cd.detectChanges();
      }
    } else {
      this.toast.error("Please Login then go for Subscription");
    }
  }

  async paymentResponseHander(id,reciept) {
    const currentUser: any = this.authService.getCurrentUser();
  
    console.log("razaor pay ide", id);
    let razId = "";
    if (id && id.raw_response && id.raw_response.razorpay_payment_id) {
      razId = id.raw_response.razorpay_payment_id;
    } else {
      razId = id;
    }
    try {
      if (id) {
        let finalPackage: any = {
          "memberId": currentUser.id,
          "docDetails": this.documentions,
         "offerId": 3,
          "appSecretKeyPassed":environment.RAZORPAY_PUBLIC_KEY,
         "referenceId": reciept,
          "transationDetails": {
            "razorpay_order_id": "string",
            "razorpay_payment_id": razId,
            "razorpay_signature": "string",
            amountPaid: 999,
            taxAmount: 0,
          }
        };
        
  
        console.log("paymentdata", finalPackage);
        if (this.userDetails.verifiedDocument && this.userDetails.verifiedDocument.length != 0) {
          this.updatePackageOfDoc(finalPackage)
        }
        else {
          let res: any = await this.userProfile.addPackages(finalPackage);
          console.log("add membepackge details no error============>", res);
          if (res && res.message == "success") {
            this.toast.success("Document Added successfully");
           this.sweetAlert()
          } else {
            if (res && res.message == "Offer has been already purchased") {
              this.toast.success("Offer has been already purchased");
            } else {
              if(res&&res.message){
                this.toast.success(res.message);
              }
              else{
                this.toast.error("Documents Uploading is Failed");
              }
            }
           this.sweetAlert()
          }
        }
     
      }
    } catch (error) {
      console.log("add membepackge details===========", error);
    }
  }

  getMemberCart() {
    return new Promise((resolve, rejects) => {
      this.product
        .GetMemberCart()
        .then((getAll: any) => {
          this.cartItemsList = (getAll.cartDetail&&getAll.cartDetail.length!=0)?getAll.cartDetail:[];
          resolve(true);
          this.cd.detectChanges();
        })
        .catch(() => {
          rejects();
        });
    });
  }
  getFileName(item) {
    console.log("item", item);
    if (item.includes("#~#")) {
      let array = item.split("#~#");
      return array[1] || "";
    } else {
      return item;
    }
  }
}
