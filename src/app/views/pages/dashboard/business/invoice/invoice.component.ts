import { Component, ViewChild, ElementRef, Input, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { productData } from '../../../shared-component/sales/product-data';
import { UserProfileService } from '../../../../../../provider/user-profile/user-profile.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


export class InvoiceItem {
  stt = '';
  name = '';
  unit = '';
  qty = '';
  cost = '';
  total = 0;
}

@Component({
  selector: 'kt-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  @ViewChild('invoiceContainer', { static: false }) invoiceContainer: ElementRef;
  @ViewChild('info1', { static: false }) info1: ElementRef;
  @ViewChild('info2', { static: false }) info2: ElementRef;

  unitList: any = []
  companyInfo: any;
  form: FormGroup;
  public invoice = {
    items: []
  };
  downloadEnable: boolean;

  ngOnInit() {
    this.unitList = productData.ProductQuantityType;
    this.getUserDetails()
  }

  download() {
    this.downloadEnable = true;
    this.cd.detectChanges();
    let data = this.form.controls.customerInfo.value;
    let content = this.form.controls.companyInfo.value;
    let text = data.split(",");
    let str = text.join(".</br>");
    let text2 = content.split(",");
    let str1 = text2.join(".</br>")
    this.info1.nativeElement.innerHTML = str;
    this.info2.nativeElement.innerHTML = str1;
    const element = this.invoiceContainer.nativeElement;
    element.classList.toggle('printmode');
    let doc = new jsPDF();

    html2canvas(element).then((canvas: any) => {
      doc.text(5, 10, this.data.sellerCompanyName);
      doc.addImage(
        canvas.toDataURL('image/jpeg'),
        'JPEG',
        0,
        20,
        doc.internal.pageSize.width,
        element.offsetHeight / 4,
      );
      doc.setFontSize(10);
      doc.setFontStyle('italic');
      doc.text(5, doc.internal.pageSize.height - 5, "Invoice created from iBizzo Invoice creator");
      doc.save(`Report-${Date.now()}.pdf`);
      element.classList.toggle('printmode');
      this.downloadEnable = false;
      this.cd.detectChanges();

    });
  }
  constructor(private fb: FormBuilder, private userProfile: UserProfileService,
    public dialogRef: MatDialogRef<InvoiceComponent>,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
    this.addItem();
  }

  getUserDetails() {
    this.userProfile.getProfile(JSON.parse(localStorage.getItem('memberData')).token)
      .then(
        (res: any) => {
          let city = res.userDetails.city ? res.userDetails.city : '';
          let state = res.userDetails.state ? res.userDetails.state : '';
          let country = res.userDetails.country ? res.userDetails.country : ''
          this.companyInfo = res;
          let companyName = res.userDetails.companyName.includes(",") ? res.userDetails.companyName : res.userDetails.companyName + ',\n'
          this.form.controls['companyInfo'].setValue("Name: " + res.userDetails.name
            + ',\n' + "Company Name: " + companyName
            + '\n' + "Address: " + city + "." + state + "." + country
            + ',\n' + "Pincode: " + res.userDetails.location)
        })

    let state = this.data.purchaserState ? this.data.purchaserState : '';
    this.companyInfo = this.data;
    let companyName = this.data.sellerCompanyName.includes(",") ? this.data.sellerCompanyName : this.data.sellerCompanyName + ',\n'

    this.form.controls['customerInfo'].setValue("Name: " + this.data.purchaserName
      + ',\n' + "Company Name: " + companyName + '\n' + "Address:" + state + ',\n' + "Pincode: " + this.data.purchaserPincode)

  }

  get invoiceItems(): FormArray {
    return this.form.get('invoiceItems') as FormArray;
  };

  addItem() {
    this.invoiceItems.push(this.fb.group(new InvoiceItem()));
  }

  removeItem(item) {
    let i = this.invoiceItems.controls.indexOf(item);

    if (i != -1) {
      this.invoiceItems.controls.splice(i, 1);
      let data = { invoiceItems: this.form.value.invoiceItems };
      this.updateForm(data);
    }
  }

  
  updateForm(data) {
    const items = data.invoiceItems;
    let sub = 0;
    for (let i of items) {
      i.total = i.qty * i.cost;
      sub += i.total;
    }
    this.form.value.subTotal = sub;
    const sgst_tax = sub * (this.form.value.sgst_taxPercent / 100);
    const cgst_tax = sub * (this.form.value.cgst_taxPercent / 100);
    this.form.value.sgst_tax = sgst_tax;
    this.form.value.cgst_tax = cgst_tax;
    this.form.value.grandTotal = sub + sgst_tax + cgst_tax;
  }

  createForm() {
    this.form = this.fb.group({
      customerInfo: ['', Validators.required],
      companyInfo: ['', Validators.required],
      invoiceName: ['', Validators.required],
      invoiceItems: this.fb.array([]),
      subTotal: [{ value: 0, disabled: true }],
      sgst_taxPercent: [],
      cgst_taxPercent: [],
      tax: [0],

      grandTotal: [{ value: 0, disabled: true }],
    });

    this.form.valueChanges.subscribe(data => this.updateForm(data));

  }

}
