import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'kt-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
  tab: number = 1
  constructor(private cd: ChangeDetectorRef) { }

  setTab(num) {
    this.tab = num;
  }

}
