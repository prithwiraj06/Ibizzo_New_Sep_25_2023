import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNotificationPageComponent } from './public-notification-page.component';

describe('PublicNotificationPageComponent', () => {
  let component: PublicNotificationPageComponent;
  let fixture: ComponentFixture<PublicNotificationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicNotificationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicNotificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
