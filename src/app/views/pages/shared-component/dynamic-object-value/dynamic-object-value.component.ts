import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'kt-dynamic-object-value',
  templateUrl: './dynamic-object-value.component.html',
  styleUrls: ['./dynamic-object-value.component.scss']
})
export class DynamicObjectValueComponent implements OnInit {
  @Output() valueChange = new EventEmitter();
  @Input() arrListInfo: any;
  key: any = [];
  value: any = [];
  arrList: any = []
  splitArray: any = []
  dyminArr = [0, 1, 2]

  keyName: any = ['eg.Brand', 'eg.Size', 'eg.Color']
  valueName: any = ['eg.MRF', 'eg.M5,M6', 'eg.Red']
  test: any = "asdsa"

  save() {
    return this.add();
  }

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.arrListInfo) {
      let data = JSON.parse(this.arrListInfo);
      let obj = {}
      let arrOfKeys = Object.keys(data);
      arrOfKeys.map((item, i) => {
        obj[item] = data[item];
        this.key[i] = item,
          this.value[i] = data[item]
        this.arrList.push(obj)
        if (i >= 3) {
          this.dyminArr.push(i)
          this.keyName.push('key');
          this.valueName.push('value');
        }
      })

      this.valueChange.emit(this.arrList)
      this.cd.detectChanges();
    }
  }

  addRow() {
    this.dyminArr.push(this.dyminArr.length)
    this.keyName.push('key');
    this.valueName.push('value');
  }



  add() {
    this.dyminArr.map((item, i) => {
      if (this.key[i] && this.value[i]) {
        let option = {
          [this.key[i]]: this.value[i]
        }
        this.arrList.push(option);
        this.cd.detectChanges();
      }
    })
    if (this.arrList && this.arrList.length != 0) {
      this.valueChange.emit(this.arrList)
      return true
    }
    else {
      return false
    }


  }

  getKeyName(key) {
    return Object.keys(key)[0]
  }

  remove(i) {
    this.arrList.splice(i, 1);
    this.dyminArr.splice(i, 1);
    this.keyName.splice(i, 1);
    this.valueName.splice(i, 1);
    this.valueChange.emit(this.arrList)
  }

}
