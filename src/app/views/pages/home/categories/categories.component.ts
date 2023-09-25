import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MainSiteService } from '../../../../../provider/main-site/main-site.service'
import _ from 'lodash';
@Component({
  selector: 'kt-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories: any = [];

  constructor(
    private mainSite : MainSiteService,
    private cd : ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.mainSite.getCategories()
    .then((res: any)=>{
     var filter1= _.filter(res.categoryWisePrdCount , function(item){return (item.category != null && item.noOfPrds != 0)})
     this.categories = _.sortBy(filter1, function(item){ return item.noOfPrds });
     this.categories.reverse();
     this.categories = this.categories.splice(0, 5);
     this.cd.detectChanges();
    })
  }

}
