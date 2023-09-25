import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalFlyerComponent } from './digital-flyer.component';

describe('DigitalFlyerComponent', () => {
  let component: DigitalFlyerComponent;
  let fixture: ComponentFixture<DigitalFlyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalFlyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalFlyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
