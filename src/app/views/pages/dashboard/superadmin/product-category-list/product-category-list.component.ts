import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "kt-product-category-list",
  templateUrl: "./product-category-list.component.html",
  styleUrls: ["./product-category-list.component.scss"],
})
export class ProductCategoryListComponent implements OnInit {
  dataList: any = 3;

  constructor(
    public dialogRef: MatDialogRef<ProductCategoryListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
}
