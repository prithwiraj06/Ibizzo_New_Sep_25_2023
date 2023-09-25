import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SignUpService } from '../../../../../../../src/provider/sign-up/sign-up.service';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../../../../../../provider/base-service/base.service'

import {
  SocialOrganisation,
  Register,
  AutoSuggestProduct,
  GetUserName,
  ApprovedOrganization,
} from './register.data';

import { ConfirmPasswordValidator } from './confirm-password.validator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TermsConditionComponent } from '../terms-condition/terms-condition.component';

@Component({
  selector: 'kt-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})


export class RegisterPageComponent implements OnInit {

  fetching: boolean = false
  @ViewChild("businessCategory", { static: true }) public businessCategory: any;
  @ViewChild("productname", { static: true }) public productname: any;
  @ViewChild("purchaserProductName", { static: true }) public purchaserProductName: any;


  canDeleteTagsParam = [];
  public categoryList = [];
  public categoryFullData = [];
  public productObject = [];
  public orgObject = [];
  submitted = false;
  public registerForm: FormGroup;
  public registerForm2: FormGroup;
  public registerForm3: FormGroup;
  public Pincode;
  public selectedType = '';

  public Social: Array<{ text: string; value: number }> = [];
  public SelectedOrganizationsObj: Array<{ text: string; value: number }> = [];
  public SelectedOrganizations = [];

  public opened = false;
  public registerHidden: boolean = false;
  public registerHidden2: boolean = true;
  public registerHidden3: boolean = true;
  public isErrorMessageHidden: boolean = true;
  ErrrMessage = '';
  public tickMarkHidden5: boolean = true;
  public tickMarkHidden6: boolean = true;
  public lubkRegAckn: boolean = true;
  public checkRegistered: boolean;
  public TypeList = [];
  public isAddDiaOpened: boolean;

  public typeDefaultItem: { name: string; id: number } = {
    name: 'Select Type',
    id: null,
  };
  confirmusername = '';
  public ProductSource: Array<AutoSuggestProduct> = [];
  public PurchaseProductSource: Array<AutoSuggestProduct> = [];
  public purchaseProductObject = [];
  public selectedProduct;
  public isRegisterDiaOpened: boolean;
  public isCaptchaDiaOpened: boolean;
  public productUserData;
  public productPurchaseUserData;
  public custOrg;
  public showTermsAndCodn: boolean = false;
  passwordShow = false;
  confirmPasswordShow = false;
  public mask: string = '+91-0000000000';
  public maskPincode: string = '000000';
  //public captchaImage = 'https://captcha.ibizzo.com/Home/GetImage?Appid=1';
  public captchaImage = 'https://captcha.labanimals.in/Home/GetImage?Appid=1';
  isOrganisationValid = true;
  isBusinessValid = true;
  customOrgId = 0;
  public finalOrgUrl;
  public finalOrgId = 0;
  /* Device Info */
  public deviceInfo;
  public readonly siteKey = '6Le8MdsUAAAAALP6wv9yLsK1T170E6e3ZsHOqv-b';
  displayMenu: boolean = true;
  Menu: boolean = true;
  tag: boolean = true;
  emailPattern: RegExp;
  pinCodePattern: RegExp;
  loading: boolean;
  inputMode: string;

  public onClickTermsAndCdnToggle(): void {
    this.showTermsAndCodn = !this.showTermsAndCodn;
    const dialogRef = this.dialog.open(TermsConditionComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }

  public close() {
    this.showTermsAndCodn = false;
  }

  constructor(
    public dialogRef: MatDialogRef<RegisterPageComponent>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private signUpService: SignUpService,
    private activatedRoute: Router,
    private formBuilder: FormBuilder,
    private base: BaseService,
    private deviceService: DeviceDetectorService,
    private http: HttpClient,
  ) {
    this.isRegisterDiaOpened = false;
    this.isCaptchaDiaOpened = false;

    this.finalOrgUrl = JSON.parse(localStorage.getItem('organizationName'));
  }

  categoryValue = '';
  organisationValue = '';
  checkCategorySelected: boolean = false;
  checkOrganisationSelected: boolean = false;
  categoryId = 1;

  tempCategory = [];

  tempOrganisation = [];

  callToProductAutoSuggest(val) {
    this.signUpService.getAutoSuggestProduct(val).then((product: any) => {
      if (product.totalRows != 0) {
        this.ProductSource = [];
        this.productObject = [];
        let productData = product.suggestedProducts;
        for (let i = 0; i < productData.length; i++) {
          this.ProductSource.push(productData[i]._source.product_unspsc_Name);
          this.productObject.push({
            name: productData[i]._source.product_unspsc_Name,
            id: productData[i]._source.product_unspsc_code,
          });
        }
      } else {
        this.ProductSource = [];
      }
    });
  }

  callToPurchaseProductAutoSuggest(val) {
    this.signUpService
      .getAutoSuggestProduct(val)
      .then((purchaseProductName: any) => {
        if (purchaseProductName.totalRows != 0) {
          this.PurchaseProductSource = [];
          this.purchaseProductObject = [];

          let purchaseProdData = purchaseProductName.suggestedProducts;
          for (let i = 0; i < purchaseProdData.length; i++) {
            this.PurchaseProductSource.push(
              purchaseProdData[i]._source.product_unspsc_Name,
            );
            this.purchaseProductObject.push({
              name: purchaseProdData[i]._source.product_unspsc_Name,
              id: purchaseProdData[i]._source.product_unspsc_code,
            });
          }
        } else {
          this.PurchaseProductSource = [];
        }
      });
  }

  callToCategoryAutoSuggest(val, isTrue?: any) {
    if (isTrue) {
      let data = {
        searchText: val[val.length - 1].displayValue,
        appKey: 'IBiz',
      };
      val = data;
    }
    this.signUpService.getAutoSuggestCategory(val).then((category: any) => {
      if (category.totalRows != 0) {
        this.categoryList = [];
        let categoryVal = category.suggestedCategories;
        this.categoryList = category.suggestedCategories;
        for (let i = 0; i < categoryVal.length; i++) {
          this.categoryList[i].selectedValue = this.categoryList[
            i
          ]._source.category_unspsc_name;
          this.categoryList[i].selectedID = this.categoryList[
            i
          ]._source.category_unspsc_code;
        }
      } else {
        this.categoryList = [];
      }
      for (let j = 0; j < this.tempCategory.length; j++) {
        this.categoryList.push(this.tempCategory[j]);
      }
    });
  }


  callToCustomIOAugoSuggest(val) {
    this.signUpService.getAutoSuggestProduct(val).then((customIO: any) => {
      if (customIO != null) {
        this.Social = [];
        let organizationVal: any = [];
        organizationVal = customIO.suggestedProducts;
        if (organizationVal != null) {
          for (let i = 0; i < organizationVal.length; i++) {
            this.Social.push({
              text: organizationVal[i].name,
              value: organizationVal[i].id,
            });
          }
        }
      }
    });
  }

  callToApprovedOrganizationAutoSuggest() {
    this.signUpService
      .getApprovedIndustryOrganization()
      .then((approvedOrg: ApprovedOrganization) => {
        if (
          approvedOrg.socialOrganizationInfo != null &&
          approvedOrg.socialOrganizationInfo.length > 0
        ) {
          this.Social = [];
          let approvedOrgVal = approvedOrg.socialOrganizationInfo;
          for (let i = 0; i < approvedOrgVal.length; i++) {
            this.Social.push({
              text: approvedOrgVal[i].name,
              value: approvedOrgVal[i].id,
            });
          }
        }
      });
  }

  callToOrganization() {
    let data = {
      applicationKey: 'IBiz',
    };
    this.signUpService
      .getSocialOrganisation(data)
      .then((socialOrg: SocialOrganisation) => {
        let u = this.activatedRoute.routerState.snapshot.url;
        let pOrg: any = [];
        pOrg = socialOrg.socialOrganizationInfo;

        let regName = u.split('/');
        if (regName[1].toLowerCase() === 'registration') {
          for (let i = 0; i < pOrg.length; i++) {
            if (pOrg[i].name.toLowerCase() === 'IBizzo'.toLowerCase()) {
              this.finalOrgId = pOrg[i].id; //parseInt(pOrg[i].id);
              this.Social.push({ text: pOrg[i].name, value: pOrg[i].id });
            }
          }
        } else {
          if (pOrg != null) {
            for (let i = 0; i < pOrg.length; i++) {
              if (
                regName[1].toLowerCase() ===
                pOrg[i].name.toLowerCase().replace(/\s/g, '-')
              ) {
                this.finalOrgId = pOrg[i].id; //parseInt(pOrg[i].id);
                this.Social.push({ text: pOrg[i].name, value: pOrg[i].id });
              }
            }
          }

          if (this.finalOrgId === undefined || this.finalOrgId === 0) {
            window.location.hostname;
          }
        }
      });
  }

  display() {
    this.displayMenu = true;
  }
  inputtag() {
    this.tag = true;
  }
  showMenu() {
    this.Menu = true
  }

  callToDBProduct(val, isTrue?: boolean) {
    if (isTrue) {
      let data = {
        searchText: val,
        appKey: 'IBiz',
      };
      val = data;
    }
    this.signUpService.getAutoSuggestDBProduct(val).then((DBproduct: any) => {
      this.ProductSource = [];
      this.productUserData = [];
      if (DBproduct.totalRows != 0) {
        let ProdSource = DBproduct.suggestedProducts;
        for (let i = 0; i < ProdSource.length; i++) {
          this.productUserData.push(
            ProdSource[i]._source.product_Name +
            ' - ' +
            ProdSource[i]._source.product_code,
          );
          this.ProductSource.push(ProdSource[i]._source.product_Name);
        }
      } else {
        this.ProductSource = [];
      }
    });
  }

  callToPurchaseDBProduct(val) {
    this.signUpService.getAutoSuggestDBProduct(val).then((DBproduct: any) => {
      this.PurchaseProductSource = [];
      this.productPurchaseUserData = [];
      if (DBproduct.totalRows != 0) {
        let ProdSource = DBproduct.suggestedProducts;
        for (let i = 0; i < ProdSource.length; i++) {
          this.productPurchaseUserData.push(
            ProdSource[i]._source.product_Name +
            ' - ' +
            ProdSource[i]._source.product_code,
          );
          this.PurchaseProductSource.push(ProdSource[i]._source.product_Name);
        }
      } else {
        this.PurchaseProductSource = [];
      }
    });
  }

  paramValue: string;

  ngOnInit() {
    this.emailPattern = this.base.emailPattern;
    this.pinCodePattern = this.base.pincode;
    this.paramValue = this.activatedRoute.routerState.snapshot.url;
    this.epicFunction();
    this.callToOrganization();
    this.callToCategoryAutoSuggest('a');
    this.callToProductAutoSuggest('a');
    this.callToPurchaseProductAutoSuggest('a');
    this.callToDBProduct('a');
    // this.callToOrganizationAutoSuggest('a');
    this.callToCustomIOAugoSuggest('a');
    this.callToApprovedOrganizationAutoSuggest();

    this.registerForm = this.formBuilder.group({
      Person: [null, Validators.required],
      companyName: ['', [Validators.required]],
      Email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailPattern),
        ],
      ],
      contact: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10,12}$')],
      ],
    });
    this.registerForm2 = this.formBuilder.group({
      // Business: ['', [Validators.required,]],
      Business: [[]],
      product: [null, Validators.required],
      purchaseProductName: [null, Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(this.pinCodePattern)]],

      Organization: [[]],
    });
    // this.value = this.registerForm2.controls.tags.valueChanges;
    this.registerForm3 = this.formBuilder.group(
      {
        username: [{ value: '', disabled: true }, Validators.required],
        password: ['', [Validators.required, Validators.minLength(7)]], //,PasswordStrengthValidator
        confirmpassword: ['', [Validators.required, Validators.minLength(7)]],
        confirm: [false, Validators.requiredTrue],
        captcha: [''],
        //recaptcha: ['', Validators.required]
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      },
    );
  }

  get f() {
    return this.registerForm.controls;
  }
  get f1() {
    return this.registerForm2.controls;
  }
  get f2() {
    return this.registerForm3.controls;
  }

  dynamicOrgPath = [];


  onClickNext() {

    this.submitted = true;
    let uname = decodeURIComponent(this.paramValue).split('/');
    if (uname.length >= 2) {

    } else {
      this.dynamicOrgPath.push(this.Social[1]);
    }

    if (this.registerForm.status == "VALID") {

      let data = {
        'emailId': this.Email.value,
        'phoneNumber': this.contact.value,
        'applicationKey': 'IBiz',
      }
      this.fetching = true;
      this.signUpService.addUsername(data)
        .then((R: GetUserName) => {
          this.fetching = false;
          if (R.isAuthenticated) {

            this.isErrorMessageHidden = false;
            this.ErrrMessage = 'Email address or Phone No is already registered. ';
            this.toastr.warning('Email address or Phone No is already registered.')
          } else {
            this.registerForm3.controls.username.setValue(this.registerForm.controls.Email.value);

            if (this.dynamicOrgPath.length > 0) {
              this.registerForm2.controls.Organization.setValue(this.dynamicOrgPath);
              this.isOrganisationValid = false;
            }

            this.signUpService.addUsername(data).then((R: GetUserName) => {
              if (R.isAuthenticated) {
                this.isErrorMessageHidden = false;

                this.ErrrMessage =
                  'Email address or Phone No is already registered. ';
                this.toastr.warning(
                  'Email address or Phone No is already registered.',
                );
              } else {
                this.registerForm3.controls.username.setValue(
                  this.registerForm.controls.Email.value,
                );

                if (this.dynamicOrgPath.length > 0) {
                  this.registerForm2.controls.Organization.setValue(
                    this.dynamicOrgPath,
                  );
                  this.isOrganisationValid = false;
                }

                this.registerHidden = true;
                this.registerHidden2 = false;
                this.submitted = false;
              }
            });
          }
        })
    }
  }




  onClickSubmit() {
    this.submitted = true

    if (this.f1.Business.value.length == 0) {
      this.isBusinessValid = true;
    }

    if (this.f1.Organization.value.length == 0) {
      this.isOrganisationValid = true;
    }

    if (this.registerForm2.status == "VALID") {
      this.fetching = true // && this.isOrganisationValid == false
      this.registerHidden3 = false;
      this.registerHidden2 = true;
      this.fetching = false
      this.submitted = true;
    }
    this.resetForm();
  };

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  resetForm() {
    if (this.deviceInfo.os == 'iOS' || this.deviceInfo.os == 'Mac') {
      this.captchaImage = 'https://captcha.ibizzo.com/Home/GetImage?Appid=ABS';
    } else {
      this.captchaImage =
        'https://captcha.ibizzo.com/Home/GetImage?Appid=' + Math.random();
    }
    // + Math.random()
  };

  onClickConfirm() {
    this.callToOrganization();
    this.submitted = true;

    let unsbcCategory = [];

    for (let i = 0; i < this.f1.Business.value.length; i++) {
      let category = {
        unsbcCode: i < 50 ? 0 : i,
        name: this.f1.Business.value[i].displayValue,
      };
      unsbcCategory.push(category);
    };

    let selectedProduct = null;
    for (let i = 0; i < this.productObject.length; i++) {
      if (this.f1.product.value == this.productObject[i].name) {
        selectedProduct = {
          id: this.productObject[i].id,
          name: this.productObject[i].name,
        };
      }
    }

    let selectedPurchaseProduct = null;
    for (let i = 0; i < this.PurchaseProductSource.length; i++) {
      if (this.f1.purchaseProductName.value == this.PurchaseProductSource[i]) {
        selectedPurchaseProduct = { name: this.PurchaseProductSource[i] };
      }
    };

    if (this.registerForm3.status == 'VALID') {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'text/plain; charset=utf-8');

      let data = {
        "name": this.f.Person.value,
        "companyName": this.f.companyName.value,
        "phoneNumber": this.f.contact.value,
        "email": this.f.Email.value,
        "unsbcCategory": unsbcCategory,
        "unsbcProductCode": selectedProduct == null ? "0" : (selectedProduct.id),
        "productType": 1,
        "producName": selectedProduct == null ? this.f1.product.value : selectedProduct.name,
        "purchaseProductName": selectedPurchaseProduct == null ? this.f1.purchaseProductName.value : selectedPurchaseProduct.name,
        "location": this.f1.pincode.value,

        "locationType": 1,
        "organizationId": this.finalOrgId,  //selectedOrg.id,  //selectedOrg == null ? 0 : (selectedOrg.id),
        "customOrganizationId": 140,
        // "OrgInfo" : this.paramValue,
        "OrgInfo": "/registration",
        "otherOrganizations": this.SelectedOrganizations,
        "password": this.f2.password.value      // "confirmPassword": this.f2.confirmpassword.value,
      }
      this.fetching = true;
      this.signUpService.registerUser(data)
        .then((R: Register) => {
          this.fetching = false;
          this.checkRegistered = R.isRegistard;
          if (this.checkRegistered) {
            this.toastr.success('Registered successfully.')
            let _data = {
              "email": this.f.Email.value,
              "phoneNumber": this.f.contact.value,
              "password": this.f2.password.value,
              "applicationKey": "IBiz"
            };

            this.signUpService.logIn(_data)
              .then((UD: any) => {

                localStorage.setItem('isAuthenticated', JSON.stringify(UD.isAuthenticated));
                localStorage.setItem('userName', JSON.stringify(UD.memberUserInfo.name));
                localStorage.setItem('companyName', JSON.stringify(UD.memberUserInfo.companyName));
                localStorage.setItem("memberData", JSON.stringify(UD.memberUserInfo));
                localStorage.setItem("token", JSON.stringify(UD.token));
                localStorage.setItem("uniqueId", JSON.stringify(UD.memberUserInfo.uniqueId));
                localStorage.setItem("organization", JSON.stringify(UD.memberUserInfo.organizationId));
                localStorage.setItem("organizationName", JSON.stringify(UD.memberUserInfo.organizationName));
              });


            this.registerHidden3 = true;

            this.lubkRegAckn = false;
          } else {
            this.toastr.error('Error in registering');

            this.isRegisterDiaOpened = true;
          }
        });
    }
  };

  onClickRegisterDiaCancel() {
    this.isRegisterDiaOpened = false;
  };

  onClickCaptchaDiaCancel() {
    this.isCaptchaDiaOpened = false;
  }

  onClickAddNewCategoryBtn() {
    this.tag = false;
  };
  get Person() {
    return this.registerForm.get('Person');
  }
  get contact() {
    return this.registerForm.get('contact');
  }
  get Email() {
    return this.registerForm.get('Email');
  }
  get companyName() {
    return this.registerForm.get('companyName');
  }
  get product() {
    return this.registerForm2.get('product');
  }
  get purchaseProductName() {
    return this.registerForm2.get('purchaseProductName');
  }
  get Business() {
    return this.registerForm2.get('Business');
  }
  get pincode() {
    return this.registerForm2.get('pincode');
  }
  get Organization() {
    return this.registerForm2.get('Organization');
  }
  get username() {
    return this.registerForm3.get('Username');
  }
  get password() {
    return this.registerForm3.get('password');
  }
  get confirmpassword() {
    return this.registerForm3.get('confirmpassword');
  }

  onClickAdd() {
    this.Menu = false;
  }

  onClickPurchaseAdd() {
    this.displayMenu = false;
  }

  onClose() {
    this.dialogRef.close();
  }

  showWindow(windoName: string) {
    this.dialogRef.close(windoName);
  }

  onTagsChanged(event: any) {
    this.registerForm2.controls['Business'].setValue(this.canDeleteTagsParam);
  }

}
