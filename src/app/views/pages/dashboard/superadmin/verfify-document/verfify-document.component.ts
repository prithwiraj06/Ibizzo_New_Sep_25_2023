import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSort } from "@angular/material";
import { MatDialog } from "@angular/material/dialog";
import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";
import { ToastrService } from "ngx-toastr";
import { UploadedDocumentsComponent } from "../uploaded-documents/uploaded-documents.component";

@Component({
  selector: 'kt-verfify-document',
  templateUrl: './verfify-document.component.html',
  styleUrls: ['./verfify-document.component.scss']
})
export class VerfifyDocumentComponent implements OnInit {
  displayedColumns: any = ["number","User","Phone","email","status", "action"];
  pageNumber = 1;
  records = 10;
  searchText: any;
  status: any = 2;
  dataSource: any = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild("sort1", { static: true }) sort: MatSort;
  fetching: boolean;
  constructor(
    private cd: ChangeDetectorRef,
    private service: SuperadminService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.fetching = true;
    this.getContents(this.pageNumber, this.records);
  }
  async getContents(pageNumber, records) {
    try {
      let res: any = await this.service.getAllDocumentUploader(
        pageNumber,
        records
      );
      this.setDataTable(res.verifyList);
      this.cd.detectChanges();
    } catch (err) {
      console.log("Failed load data");
    }
  }

  setDataTable(data) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.hasData = data.length > 0 ? true : false;
    this.fetching = false;
    this.cd.detectChanges();
  }

 

  viewUploaded(item: any) {
    let pageNumber = 1,
      records = 10;
    const dialogRef = this.dialog.open(UploadedDocumentsComponent, {
      width: "1140px",
      data:item
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.cd.detectChanges();
        return;
      }
      else {
        this.getContents(this.pageNumber, this.records);
      }
    });
  }
  pageChangeEvent(event) {
    this.fetching = true;
    if (event.pageSize == 10) {
      this.pageNumber = event.pageIndex * 10 + 1;
    } else if (event.pageSize == 20) {
      this.pageNumber = event.pageIndex * 20 + 1;
    } else if (event.pageSize == 30) {
      this.pageNumber = event.pageIndex * 30 + 1;
    }
    this.records = (event.pageIndex + 1) * event.pageSize;
    this.getContents(this.pageNumber, this.records);
  }
  async search() {
    let res: any = await this.service.getListOfContentValidation(
      this.pageNumber,
      this.records,
      this.searchText
    );
    if (res) {
      this.setDataTable(res.data);
    }
  }
  async sortData(event) {
    if (event) {
      this.fetching = true;
      let sort = {
        sortOrder: event.direction.toUpperCase(),
        sortKey: event.active,
      };
      try {
        let res: any = await this.service.getListOfContentValidation(
          this.pageNumber,
          this.records,
          "",
          sort.sortKey,
          sort.sortOrder
        );
        this.setDataTable(res.data);
      } catch {}
    }
  }
  async verified(item: any) {
    try {
      if (item) {
        console.log("mem", item);
        let res: any = this.service.markContentVerified(item.memberId);
        if (res) {
          this.toastr.success("Member is verified successfully");
          this.getContents(this.pageNumber, this.records);
          this.cd.detectChanges();
        }
      }
    } catch (err) {
      this.toastr.error("Error in verifieying member");
      this.cd.detectChanges();
    }
  }
}
