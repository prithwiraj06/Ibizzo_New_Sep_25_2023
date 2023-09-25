import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SuperadminService } from '../../../../../../provider/superadmin/superadmin.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { AddNewPackageComponent } from '../addnewpackage/addnewpackage.component'
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.scss']
})
export class PaymentSettingsComponent implements OnInit {
  displayedColumns: any = ['number', 'service', 'price', 'desc', 'action'];
  pageNumber = 1;
  records = 10;
  token: string = '';
  dataSource: any = [];
  packageDetails: any = [];
  fetching: boolean;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  constructor(private superAdmin: SuperadminService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog) { }

  ngOnInit() {
    let tokenData = JSON.parse(localStorage.getItem('memberData'));
    this.token = tokenData.token;

    this.getAllPackages();
  }

  async getAllPackages() {
    try {
      let res: any = await this.superAdmin.getAllPackageDetails(this.pageNumber, this.token, this.records);
      this.packageDetails = res;
      this.settingTableData();
      this.cd.detectChanges();
    }
    catch (e) {
      console.log(e)
    }
  }

  settingTableData() {
    this.dataSource = new MatTableDataSource<any>(this.packageDetails.packageDetails);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.hasData = (this.packageDetails.packageDetails.length > 0) ? true : false;
  }
  async pageChangeEvent(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.records = event.pageSize;
    this.superAdmin.getAllPartnerRequest(this.pageNumber, this.token, this.records)
      .then((res: any) => {
        this.packageDetails = res;
        this.settingTableData();
        this.cd.detectChanges();
      })

  }
 async delete(val) {
  Swal.fire({
    title: "Are you sure delete",
    text: "Would you like to continue?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Continue",
    cancelButtonText: "Cancel",
  }).then(async (result: any) => {
    if (result && result.value) {
      let res:any= await this.superAdmin.deletePackage(val.id);
      if(res&&res.message=='Success'){
        this.getAllPackages();
      }
    } else {
      return;
    }
  });
}
  
  edit(value) {
    const dialogRef = this.dialog.open(AddNewPackageComponent, {
      data: value
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.getAllPackages()
        this.cd.detectChanges()
        return;
      }
    });
  }

  addPackage() {
    const dialogRef = this.dialog.open(AddNewPackageComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.getAllPackages()
        this.cd.detectChanges()
        return;
      }
    });
  }
}
