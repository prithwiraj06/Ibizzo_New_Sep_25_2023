import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'kt-select-newsletter',
  templateUrl: './select-newsletter.component.html',
  styleUrls: ['./select-newsletter.component.scss']
})
export class SelectNewsletterComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SelectNewsletterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log(this.data);

  }

}
