import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MinisiteService } from '../../../../../../provider/minisite/minisite.service';
import { SuggestedClustersService } from '../../../../../../provider/suggested-cluster/suggested-clusters.service';

@Component({
  selector: 'kt-list-manged-group',
  templateUrl: './list-manged-group.component.html',
  styleUrls: ['./list-manged-group.component.scss']
})
export class ListMangedGroupComponent implements OnInit {
  remainingProducts: any = [];

  constructor(
    private service: MinisiteService,
    private cd: ChangeDetectorRef,
    private cluster: SuggestedClustersService
  ) { }

  async ngOnInit() {
    await this.getCompanyProducts();
  }

  getCompanyProducts() {
    return new Promise(async (resolve, reject) => {
      try {
        this.cluster.partnerGrouproupList()
          .then((res: any) => {
            this.remainingProducts = res;
            this.cd.detectChanges();
            resolve();
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async displayCounter(count) {
    await this.getCompanyProducts();

    console.log(count);
  }

}
