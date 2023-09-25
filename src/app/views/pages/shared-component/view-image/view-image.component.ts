import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { BaseService } from "../../../../../provider/base-service/base.service";
@Component({
  selector: "kt-view-image",
  templateUrl: "./view-image.component.html",
  styleUrls: ["./view-image.component.scss"],
})
export class ViewImageComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: BaseService,
    public dialogRef: MatDialogRef<ViewImageComponent>
  ) {}

  ngOnInit() {}
  getImage(image) {
    return this.service.getImageUrl(image, "GetDownload");
  }
}
