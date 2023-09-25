import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SuperadminService } from "../../../../../provider/superadmin/superadmin.service";
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from "@angular/material";
import * as _ from "underscore";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { UpdateDiscriptionComponent } from "./update-discription/update-discription.component";

@Component({
  selector: "kt-super-admin",
  templateUrl: "./super-admin.component.html",
  styleUrls: ["./super-admin.component.scss"],
})
export class SuperAdminComponent implements OnInit {
  displayedColumns: any = [
    "number",
    "groupname",
    "email",
    "phoneNumber",
    "connections",
    "status",
    "switch",
    "visible",
    "action",
    "role",
    "update"
  ];
  pageNumber = 1;
  records = 10;
  token: string = "";
  dataSource: any = [];
  ArrayDataSource: any = [];
  fetching: boolean;
  // groups: any = "groups"

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;

  partnerUsers: any = [];
  constructor(
    private superAdmin: SuperadminService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    let tokenData = JSON.parse(localStorage.getItem("memberData"));
    this.token = tokenData.token;
    this.getAllPartnerRequest(this.pageNumber, this.records, this.token);
  }

  async getAllPartnerRequest(pageNumber, records, token) {
    try {
      let res: any = await this.superAdmin.getAllPartnerRequest(
        pageNumber,
        records,
        token
      );
      this.settingTableData(res.partnerUsers);
      this.cd.detectChanges();
    } catch (e) {
      console.log(e);
    }
  }

  settingTableData(data) {
    if (data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.sort = this.sort;
      this.dataSource.hasData = data.length > 0 ? true : false;
    }
  }
  async pageChangeEvent(event: any) {
    this.pageNumber = this.paginator.pageSize * this.paginator.pageIndex + 1;
    this.records = this.paginator.pageSize * (this.paginator.pageIndex + 1);
    this.superAdmin
      .getAllPartnerRequest(this.pageNumber, this.records, this.token)
      .then((res: any) => {
        this.partnerUsers = res;
        this.settingTableData(this.partnerUsers.partnerUsers);
        this.cd.detectChanges();
      });
  }

  async validate(partner: any) {
    let data = {
      token: this.token,
      requestInfo: [
        {
          memberId: partner.memberId,
          requestId: partner.requestId,
        },
      ],
      applicationKey: "IBiz",
    };
    let res = await this.superAdmin.getToValidateRequest(data);
    if (res) {
      this.getAllPartnerRequest(this.pageNumber, this.records, this.token);
      this.cd.detectChanges();
    }
  }

  update(value){
    const dialogRef = this.dialog.open(UpdateDiscriptionComponent, {
      data: value
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });
  }

  reject(partner: any) {
    let data = {
      token: this.token,
      requestInfo: [
        {
          memberId: partner.memberId,
          requestId: partner.requestId,
        },
      ],
      applicationKey: "IBiz",
    };
    this.superAdmin.getToRejectRequest(data);
    this.getAllPartnerRequest(this.pageNumber, this.records, this.token);
    this.cd.detectChanges();
  }

  async enableAndDisablePayment(element: any, index: number) {
    const value: boolean = !element.isPaymentEnabled;
    let data = {
      token: this.token,
      PartnerPaymentInfo: [
        {
          memberId: element.memberId,
          requestId: element.requestId,
          IsPaymentEnabled: value,
        },
      ],
      applicationKey: "IBiz",
    };
    let res = await this.superAdmin.getPaymentStatus(data);

    if (res) {
      this.dataSource.filteredData[index].isPaymentEnabled = value;
      this.getAllPartnerRequest(this.pageNumber, this.records, this.token);
      this.cd.detectChanges();
    }
    this.toastr.show(value ? "Payment Enabled" : "Payment Disabled");
  }

  selectOption(item) {
    console.log(item);

    Swal.fire({
      title: "Are you sure to change the Role",
      text: "Would you like to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continue",
      cancelButtonText: "Cancel",
    }).then(async (result: any) => {
      if (result && result.value) {
        let checkUpdate: any = await this.superAdmin.canUpdate(item.groupId);
        if (!checkUpdate.canUpgrade) {
          Swal.fire({
            title:
              "Cannot Upgrade this Group to Partner. A partner already exists for this Group Owner",
            icon: "warning",
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: "Ok",
          }).then(async (res) => {
            if (res) {
              this.getAllPartnerRequest(
                this.pageNumber,
                this.records,
                this.token
              );
            }
          });
        } else {
          let res: any = await this.superAdmin.convertGroupToPartner(
            item.groupId
          );
          console.log(res);
          if (res.message == "Group converted to partner successfully") {
            this.toastr.success(res.message);
          } else {
            this.toastr.error(res.message);
          }
          this.getAllPartnerRequest(this.pageNumber, this.records, this.token);
        }
      } else {
        this.getAllPartnerRequest(this.pageNumber, this.records, this.token);
      }
    });
  }

  getStatusClass(element: any, className: string, type: string) {
    if (element.groupId != null && element.partnerId == 0) {
      return "title-color";
    }
    className =
      className +
      " kt-" +
      type +
      (element.status == 1
        ? "success"
        : element.status == 2
        ? "danger"
        : "warning");
    return className;
  }
  getStatusText(status: any) {
    if (status == 1) {
      return "Approved";
    } else if (status == 2) {
      return "Rejected";
    } else {
      return "Validating";
    }
  }
  getSwitch(element) {
    return element.groupId == null && element.partnerId == 0 ? true : false;
  }
  async checkVisible(element: any, index: number) {
    const value: boolean = !element.isView;
    let data = {
      token: "IBiz",
      requestId: element.requestId,
      isView: value,
    };
    let res = await this.superAdmin.visiblePartner(data);

    if (res) {
      this.getAllPartnerRequest(this.pageNumber, this.records, this.token);
      this.cd.detectChanges();
    }
    this.toastr.success(
      value ? "Partner is visible" : "Partner will be hidden"
    );
  }
}
