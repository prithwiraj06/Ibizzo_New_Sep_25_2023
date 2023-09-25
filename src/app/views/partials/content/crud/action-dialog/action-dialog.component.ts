import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: [ './action-dialog.component.scss' ]
})
export class ActionDialogComponent implements OnInit {

  enableRfqButton: boolean = false;
  constructor (
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    if (this.data.textOne == "Get Quotes For Similar Products") {
      this.dialogRef.close({ searchHsn: true });
    } else {
      this.dialogRef.close();
    }
  }

  resetForm() {
    this.dialogRef.close({ resetForm: true });
  }

  onYesClick(): void {
    if (this.data.submitText == "Pay Now/Cart") {
      this.dialogRef.close({ 'subscription': true });
    } else {
      this.dialogRef.close();
    }
  }
}
