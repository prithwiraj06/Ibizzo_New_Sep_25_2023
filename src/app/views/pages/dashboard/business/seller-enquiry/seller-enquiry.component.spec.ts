import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerEnquiryComponent } from './seller-enquiry.component';

describe('SellerEnquiryComponent', () => {
  let component: SellerEnquiryComponent;
  let fixture: ComponentFixture<SellerEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
