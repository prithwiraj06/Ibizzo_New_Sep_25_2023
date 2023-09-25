import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "kt-unspsc-codes-list",
  templateUrl: "./unspsc-codes-list.component.html",
  styleUrls: ["./unspsc-codes-list.component.scss"],
})
export class UnspscCodesListComponent implements OnInit {
  dataList: any = 1;

  constructor(
    public dialogRef: MatDialogRef<UnspscCodesListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
}
