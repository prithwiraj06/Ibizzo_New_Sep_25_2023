import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-add-annoucements',
  templateUrl: './add-annoucement.component.html',
  styleUrls: ['./add-annoucement.component.scss']
})
export class AddAnnoucementComponent implements OnInit {
ids:any=0;
  constructor(
    private ActiveRouter:ActivatedRoute
  ) { }

  ngOnInit() {
    this.ActiveRouter.params.subscribe((res)=>{
      if(res&&res.id){
          this.ids=res.id
      }
    })
  }

}
