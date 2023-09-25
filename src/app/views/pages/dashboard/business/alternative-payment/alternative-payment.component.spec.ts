import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativePaymentComponent } from './alternative-payment.component';

describe('AlternativePaymentComponent', () => {
  let component: AlternativePaymentComponent;
  let fixture: ComponentFixture<AlternativePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlternativePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternativePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
