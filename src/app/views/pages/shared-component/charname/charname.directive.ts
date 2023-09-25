import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[charname]'
})
export class CharnameDirective implements OnChanges {
  @Input() charname: string;
  constructor(public el: ElementRef) {
  }

  ngOnChanges(){
    if(this.charname){
      this.el.nativeElement.innerHTML = (this.charname || '').substr(0, 2);
    }
  }
}