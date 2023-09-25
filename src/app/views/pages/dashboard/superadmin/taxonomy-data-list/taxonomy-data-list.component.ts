import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SharedDataTableComponent } from '../shared-data-table/shared-data-table.component'
@Component({
  selector: 'kt-taxonomy-data-list',
  templateUrl: './taxonomy-data-list.component.html',
  styleUrls: ['./taxonomy-data-list.component.scss']
})
export class TaxonomyDataListComponent implements OnInit {
  @ViewChild('unspsc', { static: false }) public SharedDataTableComponent: SharedDataTableComponent
  displayColums = [
    '#',
    'name',
    'unspc',
    'hsn',
    'product',
    'system'
  ]
  displayColums1 = [
    '#',
    'name',
    'unspc',
    'hsn',
  ]
  user: boolean = true;
  unspsc: boolean = false;
  productService: any;
  selectedIndex: any;
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  onTabPanelClick(event, tab) {
    this.user = event.index === 0 ? true : false;
    this.unspsc = event.index === 1 ? true : false;
  }

  searchMembers() {
    this.SharedDataTableComponent.searchContent(this.productService, this.unspsc ? 'unspsc' : 'user');
    this.productService = '';
    this.cd.detectChanges();
  }

}
