import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
@Component({
  selector: "kt-hsn-list",
  templateUrl: "./hsn-list.component.html",
  styleUrls: ["./hsn-list.component.scss"],
})
export class HsnListComponent implements OnInit {
  sendItems: boolean = false;
  searchText: string = "";
  loading: boolean = true;
  text: any;
  option: number = 1;
  constructor(
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<HsnListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.searchText = this.data.hsnCode;
  }
}
