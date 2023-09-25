import { Component, OnInit, Input } from '@angular/core';
import { MinisiteService } from '../../../../../provider/minisite/minisite.service';
import _ from 'lodash';

@Component({
  selector: 'kt-product-image-gallery',
  templateUrl: './product-image-gallery.component.html',
  styleUrls: ['./product-image-gallery.component.scss']
})
export class ProductImageGalleryComponent implements OnInit {

  @Input() productImages: any;
  @Input() colors: any;
  @Input() search: any = false;
  @Input() isParterMember:any=false

  constructor(
    private service: MinisiteService,
  ) { }

  ngOnInit() {
  }
}
