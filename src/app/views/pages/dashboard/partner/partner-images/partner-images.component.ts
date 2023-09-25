import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../../../provider/product-service/product-service.service';
import { PartnerService } from '../../../../../../provider/partner/partner.service';
import { AuthService } from '../../../../../views/pages/auth/auth.service';

import _ from 'lodash';

@Component({
  selector: 'kt-partner-images',
  templateUrl: './partner-images.component.html',
  styleUrls: ['./partner-images.component.scss']
})
export class PartnerImagesComponent implements OnInit {

  form: FormGroup;
  loading: any = {
    'upload': false,
    'imageGalleryLoad': true,
    'promoGalleryLoad': true
  };
  diasableBtn: boolean = true;
  currentUser: any;

  imageGallery: any = [
    {
      "description": '',
      "imageName": '',
      "priority": 0
    },
    {
      "description": '',
      "imageName": '',
      "priority": 1
    },
    {
      "description": '',
      "imageName": '',
      "priority": 2
    },
    {
      "description": '',
      "imageName": '',
      "priority": 3
    },
    {
      "description": '',
      "imageName": '',
      "priority": 4
    }
  ];

  //promotion image gallery
  promotionGallery: any = [
    {
      "description": '',
      "imageName": '',
      "priority": 5
    },
    {
      "description": '',
      "imageName": '',
      "priority": 6
    },
    {
      "description": '',
      "imageName": '',
      "priority": 7
    },
    {
      "description": '',
      "imageName": '',
      "priority": 8
    }
  ];

  constructor(
    private imageUploadService: ProductService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private partnerService: PartnerService,
    private authService: AuthService,
  ) { }

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.getPartnerImage();
  }

  async getPartnerImage() {
    try {
      let res: any = await this.partnerService.getPartnerImagesByToken(this.currentUser.partnerInfo.id);
      let images = res.imageDetails || [];
      if (images.length > 0) {

        //for image gallery
        _.each(images, _item => {
          _.each(this.imageGallery, item2 => {
            if (item2.priority == _item.priority) {
              item2.imageName = _item.imageName;
              item2.description = _item.description;
              item2.url = _item.url;
            }
          })
        })

        //for promotion gallery
        _.each(images, item => {
          _.each(this.promotionGallery, item3 => {
            if (item3.priority == item.priority) {
              item3.imageName = item.imageName;
              item3.description = item.description;
              item3.url = item.url;
            }
          })
        })
      }
      this.loading.promoGalleryLoad = false;
      this.loading.imageGalleryLoad = false;
      this.cd.detectChanges();
    } catch (e) { }
  }

  getImage(image) {
    if (image) {
      return this.imageUploadService.getImageUrl(image, 'GetDownload');
    } else {
      return 'https://www.gumtree.com/static/1/resources/assets/rwd/images/orphans/a37b37d99e7cef805f354d47.noimage_thumbnail.png';
    }
  }

  //file upload
  async fileUpload(event, item) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        if (file.size < 1200000) {
          this.diasableBtn = false;
          reader.onload = (e: any) => {
          };
          reader.readAsDataURL(file);
          try {
            let image = await this.imageUploadService.uploadProductImages(file);
            item.imageName = image;
            this.cd.detectChanges();
          }
          catch (e) { }
        } else {
          this.toastr.error('Please Upload image Size less than 1 MB.');
        }
      }
    }
  }

  deleteImage(array, index) {
    this.diasableBtn = false;
    array[index].imageName = "";
    array[index].description = "";
  }

  async submit() {
    let data = [];
    this.loading.upload = true;
    _.each(this.imageGallery, item => {
      if (item.imageName) {
        data.push(item);
      }
    })

    _.each(this.promotionGallery, item => {
      if (item.imageName) {
        data.push(item);
      }
    })

    if (this.currentUser) {
      let payload: any = {
        "imageDetails": data,
        "orgId": this.currentUser.partnerInfo.id,
        "partnerId": this.currentUser.id,
        "message": ""
      }

      try {
        let res: any = await this.partnerService.uploadPartnerImages(payload);
        if (res.message == "Images Updated sucessfuly") {
          this.loadingFalse('Images Updated sucessfuly', false);
        } else {
          this.loadingFalse('Failed in uploading images', true);
        }
      } catch (e) { this.loadingFalse('Failed in uploading images', true); }
    }
  }


  //handle loading false condition
  loadingFalse(text, error) {
    if (error) {
      this.toastr.error(text);
    } else {
      this.toastr.success(text);
    }
    this.loading.upload = false;
    this.cd.detectChanges();
  }
}
