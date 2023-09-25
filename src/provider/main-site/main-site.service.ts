import { Injectable } from "@angular/core";
import { BaseService } from "../base-service/base.service";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import _ from "lodash";

@Injectable({
  providedIn: "root",
})
export class MainSiteService extends BaseService {
  constructor(private _http: HttpClient) {
    super(_http);
  }

  getStatistics(oganizationId: number) {
    let params = {
      reportType: "DashBoard",
      reports: [
        {
          type: "DashBoard",
          name: "OrgStats",
          noOfRecsPerPage: 1,
          reportMatch: "string",
          pageNumber: 10,
        },
      ],
      memberId: 0,
      companyId: 0,
      orgId: oganizationId,
      reportMode: "string",
    };

    return this.post("DashBoard/GetDashBoardReport", params);
  }

  getAllOrgStatistics(oganizationId: number) {
    let params: any = {
      ApplicationKey: "IBiz",
      OganizationId: oganizationId,
    };
    return this.get("Dashboard/GetOrgMemProdCount", params);
  }

  getAllOrgSaleSatatistics(oganizationId: number) {
    let params: any = {
      ApplicationKey: "IBiz",
      OganizationId: oganizationId,
    };
    return this.get("Dashboard/GetOrgCompSalePurchaseCount", params);
  }

  postPartnerUser(data: any) {
    let params: any = data;
    return this.post("PartnerUser/RaiseAPartnerUserRequest", params);
  }

  getPartnerGroup(data: any) {
    let params: any = data;
    return this.get("PartnerUser/RaiseAPartnerUserRequest", params);
  }

  getNewArrivals(data: any) {
    let params: any = data;
    let products: any = [];

    return new Observable<any>((observer) => {
      this.post("DashBoard/GetNewArrivalPrds", params).then((result: any) => {
        products =
          result && result.userProducts ? result.userProducts : products;
        var filterProduct = _.filter(products, function (item) {
          return item.productImages.length > 0;
        });
        products = filterProduct;
        localStorage.setItem("NEW_ARRITALS", JSON.stringify(products));
        observer.next(products);
      });

      // get the cached content
      products = JSON.parse(localStorage.getItem("NEW_ARRITALS"));
      products = products != null ? products : [];
      observer.next(products);
    });
  }

  getCategories() {
    let params = {
      reportType: "string",
      reports: [
        {
          name: "CategoryWisePrdCount",
          noOfRecsPerPage: 10,
          pageNumber: 1,
        },
      ],
      orgId: 1,
    };

    return this.post("DashBoard/GetDashBoardReport", params);
  }

  productsAndServices(data: any) {
    let params: any = data;
    return this.post("DashBoard/TopPrdAndSrvs", params);
  }
}
