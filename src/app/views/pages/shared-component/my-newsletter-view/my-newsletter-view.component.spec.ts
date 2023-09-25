import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNewsletterViewComponent } from './my-newsletter-view.component';

describe('MyNewsletterViewComponent', () => {
  let component: MyNewsletterViewComponent;
  let fixture: ComponentFixture<MyNewsletterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNewsletterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNewsletterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
