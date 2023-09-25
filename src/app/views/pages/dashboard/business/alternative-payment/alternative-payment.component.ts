import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'kt-alternative-payment',
  templateUrl: './alternative-payment.component.html',
  styleUrls: ['./alternative-payment.component.scss']
})
export class AlternativePaymentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AlternativePaymentComponent>,
  ) { }

  ngOnInit() {
  }

}
