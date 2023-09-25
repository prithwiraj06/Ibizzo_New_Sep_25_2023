import { Component, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.css']
})
export class TermsConditionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TermsConditionComponent>,
  ) { }

  ngOnInit() {
  }

  onClose(){
    this.dialogRef.close();
  }

}
