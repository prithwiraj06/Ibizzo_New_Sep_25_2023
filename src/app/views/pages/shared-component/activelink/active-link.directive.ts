import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[activeLink]'
})

export class ActiveLinkDirective implements OnInit{
  @Input('activeLink') link: string;
  constructor(
    public el: ElementRef,
    private router: Router,
  ) {
  }

	ngOnInit(): void {
    this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => {
				if(this.router.url == this.link){
          this.el.nativeElement.classList.add('active');
        } else {
          this.el.nativeElement.classList.remove('active');
        }
			});
  }
}
