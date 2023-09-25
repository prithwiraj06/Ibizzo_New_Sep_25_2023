import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaserEnquiryComponent } from './purchaser-enquiry.component';

describe('PurchaserEnquiryComponent', () => {
  let component: PurchaserEnquiryComponent;
  let fixture: ComponentFixture<PurchaserEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaserEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaserEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
