import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerNotificationComponent } from './seller-notification.component';

describe('SellerNotificationComponent', () => {
  let component: SellerNotificationComponent;
  let fixture: ComponentFixture<SellerNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
