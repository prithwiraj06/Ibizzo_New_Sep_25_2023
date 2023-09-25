import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SignUpService extends BaseService {
  constructor(private _http: HttpClient) {
    super(_http);
  }

  logIn(data: any) {
    const params = data;
    return this.get("User/AuthenticateUserAsync", params);
  }

  getUsername(data: any) {
    const params = data;
    return this.get("User/GetUserName", params);
  }

  addUsername(data: any) {
    const params = data;
    return this.post("User/GetUserName", params);
  }

  addpassword(data: any) {
    const params = data;
    return this.post("User/AuthenticateUserAsync", params);
  }

  registerUser(data: any) {
    const params = data;
    return this.post("Register/RegisterMemberAsync", params);
  }

  changePassword(data: any) {
    const params = data;
    return this.post("User/UpdateForgotPassword", params);
  }

  forgotPassword(data: any) {
    const params = data;
    return this.post("User/ForgotPassword", params);
  }

  getApprovedIndustryOrganization() {
    const params = {
      applicationKey: "IBiz",
    };
    return this.get("Register/GetOrganization", params);
  }

  sendRegistrationOtp(phone, url) {
    const param = {
      Token: "IBiz",
      NewPhoneNumber: phone,
    };
    return this.post("User/" + url, undefined, param);
  }

  verifyOtp(otp, url) {
    return this.post(url, otp);
  }

  getCaptcher(value: any) {
    const params = {
      CaptchaCode: value,
      AppID: "ABS",
    };
    return this.getCaptch(
      "https://captcha.ibizzo.com/Home/VerifyCaptcha",
      params
    );
  }

  // register(data:any){
  //   const params=data;
  //   return this.get('Register/RegisterMemberAsync',params)
  // }

  getSocialOrganisation(data: any) {
    const params = data;
    return this.get("Register/GetOrganization", params);
  }

  getAutoSuggestProduct(data: any) {
    const params = data;
    return this.get("UserProduct/GetAutoSuggestProduct", params);
  }

  getAutoSuggestCustomIO(data: any) {
    const params = data;
    return this.get("Register/GetCustomOrganization", params);
  }

  getAutoSuggestDBProduct(data: any) {
    const params = data;
    return this.get("UserProduct/GetAutoSuggestDbProduct", params);
  }

  getAutoSuggestCategory(text) {
    let textVal = text == "" ? "a" : text;
    return this.get("UserProduct/GetAutoSuggestCategory", textVal);
  }

  verifyEmail(eMail: string) {
    let params: any = {
      Token: "IBizzo",
      Email: eMail,
    };
    return this.post("InvMembrReg/IsEmailExist", undefined, params);
  }

  registerInvitedMember(data: any) {
    const params = {
      Token: "IBizzo",
    };
    return this.post("InvMembrReg/ProcessRegistration", data, params);
  }

  // getApprovedIndustryOrganization(data: any){
  //   const params = data;
  //   return this.get(params,null)
  // }
}
