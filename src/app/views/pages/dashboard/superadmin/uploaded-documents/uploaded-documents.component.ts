import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../../environments/environment';
import { SuperadminService } from "../../../../../../provider/superadmin/superadmin.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'kt-uploaded-documents',
  templateUrl: './uploaded-documents.component.html',
  styleUrls: ['./uploaded-documents.component.scss']
})
export class UploadedDocumentsComponent implements OnInit {

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

  constructor(public dialogRef: MatDialogRef<UploadedDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: SuperadminService,
    private toastr:ToastrService
  ) { }

 async ngOnInit() {
   this.getInit();
 }
  
  async getInit() {
    let res:any = await this.service.getUploadedDocByMem(this.data.memberId);
    if (res && res.docDetails) {
      this.documents=res.docDetails
    }
  }
  
 getDocName(doc: any) {
  let file = doc.includes("#~#") ? doc.split("#~#")[1] : doc;
  return file.includes("%20") ? file.replace(/%20/g, " ") : file;
 }
  
  getTitle(doc) {
    let key = this.getKeyByValue(this.titleOfFile, doc);
    let name = this.nameOfTitle[key]
    return name
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  async verifyPage() {
    let res: any = await this.service.verifyDocBySup(this.data.memberId);
    if (res && res.updated > 0) {
      this.toastr.success("Successfully Document Verfied")
      this.dialogRef.close(res)
    }
    else {
      this.toastr.error("Failed to Update")
    }
  }
  
  
  
  getRoute(doc: any) {
    let file = doc.includes("#~#") ? doc.replace(/#~#/g, "%23~%23")  : doc;
  return (
    environment.API_URL +
    "Upload/GetVerifiedDocumentDownload?filename=" +
    file
  );
}

}
