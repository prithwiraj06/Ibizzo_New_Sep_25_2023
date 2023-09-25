import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../../../../provider/product-service/product-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-search-category',
  templateUrl: './search-category.component.html',
  styleUrls: ['./search-category.component.scss']
})
export class SearchCategoryComponent implements OnInit {

  organizations: any = [];
  categoryId: any;
  buttonLabel: any;

  constructor(
    private product: ProductService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.categoryId) {
        this.categoryId = parseInt(params.categoryId);
      }
    })
    this.getDataByCategory();
  }
  getDataByCategory() {
    this.buttonLabel = 'More Details';
    this.product.searchByCategory(this.categoryId)
      .then((res: any) => {
        this.organizations = res;
        this.cd.detectChanges();

      })
  }
}
