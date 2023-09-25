import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationFlyerComponent } from './notification-flyer.component';

describe('NotificationFlyerComponent', () => {
  let component: NotificationFlyerComponent;
  let fixture: ComponentFixture<NotificationFlyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationFlyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationFlyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
