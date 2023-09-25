import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ProductService } from '../../../../../../provider/product-service/product-service.service';
import * as _ from 'underscore'
import { HelperDialogComponent } from '../helper-dialog/helper-dialog.component';
@Component({
  selector: 'kt-cart-details-info',
  templateUrl: './cart-details-info.component.html',
  styleUrls: ['./cart-details-info.component.scss']
})
export class CartDetailsInfoComponent implements OnInit {
  uploadedImage: any = [
    {
      type: 'UPLOAD_IMAGES',
      source:
        '/assets/media/files/jpg.svg',
    },
    {
      type: 'UPLOAD_LOGO',
      source:
        '/assets/media/icons/exchange.svg',
    },
    {
      type: 'UPLOAD_DOCS',
      source:
        '/assets/media/files/doc.svg',
    },
  ];
  cartItemsList: any = [];
  totalAmountPayable: any;
  constructor(
    public dialogRef: MatDialogRef<CartDetailsInfoComponent>,
    private product: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef


  ) { }

  ngOnInit() {
    console.log(this.data);
    this.cartItemsList = this.data.result.cartDetail;
    this.totalAmountPayable = this.data.result.grandTotalPayable;
  }

  getImagesServices(packageDetailName: string, fileName: string) {

    if (fileName && (['UPLOAD_IMAGES', 'UPLOAD_LOGO', 'PRODUCT_IMAGE_SLOT1', 'PRODUCT_IMAGE_SLOT2', 'PRODUCT_IMAGE_SLOT3', 'PRODUCT_IMAGE_SLOT4'].indexOf(packageDetailName) > -1)) {
      return this.product.getImageUrl(fileName);
    }

    let index = _.findIndex(this.uploadedImage, { type: packageDetailName });
    if (index > -1) {
      return this.uploadedImage[index].source;
    } else {
      return '/assets/media/client-logos/logo1.png';
    }
  }

  async approvedTransaction(event: any) {
    // const dialogRef = this.dialog.open(HelperDialogComponent, {
    //   width: "500px",
    //   height: "300px",
    //   data: {
    //     info: event,
    //     type: 1,
    //     id: 1
    //   }
    // })
    // dialogRef.afterClosed().subscribe((result) => {
    //   debugger
    //   if (!result) {
    //     return
    //   }
    this.dialogRef.close('Approved')
    this.cd.detectChanges();
    //   })
  }

}
