import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
declare var window: any;
@Directive({
  selector: '[ktsmartlink]'
})
export class HyperlinkDirective implements OnChanges{
  @Input('ktsmartlink') link: string;
  constructor(public el: ElementRef) {
  }

  ngOnChanges(){
    if(this.link){
      let anchor = window.document.createElement('a');
      anchor.href = this.link;
      this.el.nativeElement.innerHTML = `${anchor.protocol}//${anchor.host}`;
    }
  }
}
