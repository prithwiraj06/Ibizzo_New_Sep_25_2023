import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNewsletterComponent } from './my-newsletter.component';

describe('MyNewsletterComponent', () => {
  let component: MyNewsletterComponent;
  let fixture: ComponentFixture<MyNewsletterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNewsletterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
