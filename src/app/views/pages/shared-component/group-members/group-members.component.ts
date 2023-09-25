import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectorRef,
  Inject,
} from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatDialogRef,
  MatSort,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material";
import { SettingService } from "../../../../../provider/setting/setting.service";
import { FormGroupDirective } from "@angular/forms";
@Component({
  selector: "kt-group-members",
  templateUrl: "./group-members.component.html",
  styleUrls: ["./group-members.component.scss"],
})
export class GroupMembersComponent implements OnInit {
  @Input() type: any;
  @Input() groupId: any;
  token: any;
  searchText: any;
  pageNumber: number = 1;
  records: number = 10;
  fetching: boolean = true;
  dataSource: any = [];
  displayedColumns: any = ["#", "name"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("sort1", { static: true }) sort: MatSort;
  constructor(
    public dialogRef: MatDialogRef<GroupMembersComponent>,
    private setting: SettingService,
    private cd: ChangeDetectorRef // @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.type == "new") {
      this.displayedColumns.push(
        "email",
        "companyName",
        "phone",
        "status",
        "action"
      );
      this.getNewRequest(this.pageNumber, this.records);
    } else if (this.type == "member") {
      this.displayedColumns.push("email", "phone", "sales", "purchase");
      this.getGroupMemeber(this.pageNumber, this.records);
    }
  }
  async getGroupMemeber(pageNumber, records) {
    try {
      let param = {
        groupId: this.groupId,
        pageNumber: pageNumber,
        records: records,
      };
      let data: any = await this.setting.getGroupMember(param);
      this.setDataTable(data);
      this.fetching = false;
      this.cd.detectChanges();
    } catch (e) {
      console.log("Failed to fetch the data");
      this.fetching = false;
    }
  }
  async getNewRequest(pageNumber, records) {
    try {
      let param = {
        groupId: this.groupId,
        pageNumber: pageNumber,
        records: records,
      };
      let data: any = await this.setting.getNonAdminGroupList(param);
      this.setDataTable(data);
      this.cd.detectChanges();
    } catch (e) {
      console.log("Failed to fetch the data");
      this.fetching = false;
    }
  }
  setDataTable(data) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.hasData = data.length > 0 ? true : false;
    this.fetching = false;
    this.cd.detectChanges();
  }
  pageChangeEvent(event) {
    this.fetching = true;
    this.pageNumber = this.paginator.pageIndex * this.paginator.pageSize + 1;
    this.records = (this.paginator.pageIndex + 1) * this.paginator.pageSize;
    if (this.type == "member") {
      this.getGroupMemeber(this.pageNumber, this.records);
    } else if (this.type == "new") {
      this.getNewRequest(this.pageNumber, this.records);
    }
  }
  getTitle() {
    if (this.type == "new") {
      return " New Requests";
    } else {
      return "Memebrs";
    }
  }
  getStatusClass(element: any, className: string, type: string) {
    className =
      className +
      " kt-" +
      type +
      (element.isMember == 1
        ? "success"
        : element.isMember == 0
        ? "danger"
        : "warning");
    return className;
  }
  getStatusText(status: any) {
    if (status == 1) {
      return "Approved";
    } else if (status == 0) {
      return "Rejected";
    } else {
      return "Validating";
    }
  }
  async validate(member: any) {
    let data = {
      memberId: member.memberId,
      groupId: this.groupId,
      isMember: true,
    };
    let res = await this.setting.validateGroupMembership(data);
    if (res) {
      this.getNewRequest(this.pageNumber, this.records);
      this.cd.detectChanges();
    }
  }
  async reject(member: any) {
    let data = {
      memberId: member.memberId,
      groupId: this.groupId,
      isMember: false,
    };
    let res = await this.setting.validateGroupMembership(data);
    if (res) {
      this.getNewRequest(this.pageNumber, this.records);
      this.cd.detectChanges();
    }
  }
}
