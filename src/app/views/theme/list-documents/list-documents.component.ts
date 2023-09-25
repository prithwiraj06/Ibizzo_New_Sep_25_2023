import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'underscore';
import { SuperadminService } from "../../../../provider/superadmin/superadmin.service";

@Component({
  selector: 'kt-list-documents',
  templateUrl: './list-documents.component.html',
  styleUrls: ['./list-documents.component.scss']
})
export class ListDocumentsComponent implements OnInit {

  documents: any = []
  titleOfFile: any = {
    pan: 'PAN',
    shop: 'ESTABLISHMENT',
    GST: 'GST',
    partnership: 'PARTNERSHIP',
    pollution: 'POLLUTION',
    Aadhar: 'AADHAR',
    Quality: 'QUALITY',
    Recognition: 'RECONGNITION',
    exports: 'EXPORT',
    MSME: 'MSME',
    Factory: 'FACTORY'
  }

  nameOfTitle: any = {
    pan: 'Company PAN card',
    shop: 'Shop & Establishment Certificate',
    GST: 'GST certificate',
    partnership: 'Certificate of Incoporation/LLP certificate/Partnership Certificate',
    pollution: 'Pollution Control Board certifications',
    Aadhar: 'Udyam Aadhar',
    Quality: 'Quality Certification (Ex : ISO )',
    Recognition: 'Startup Recognition certificate',
    exports: 'Export/Import Certifications',
    MSME: 'MSME Certificate',
    Factory: 'Company/Shop/Factory Images'
  }

  titles:any=[]
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef:MatDialogRef<ListDocumentsComponent>,
    private service: SuperadminService
  ) { }

  async ngOnInit() {
    this.getInit();
  }
   
  async getInit() {
    let res: any = await this.service.getUploadedDocByMem(this.data.id);
    if (res && res.docDetails) {
      this.documents = res.docDetails
      _.each(this.documents, (item) => {
        let name = this.getTitle(item.docType)
        this.titles.push(name)
      })
    }


  }

  getTitle(doc) {
    let key = this.getKeyByValue(this.titleOfFile, doc);
    let name = this.nameOfTitle[key]
    return name
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }


}
