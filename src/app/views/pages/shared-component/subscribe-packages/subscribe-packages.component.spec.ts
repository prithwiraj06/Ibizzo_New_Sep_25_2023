import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribePackagesComponent } from './subscribe-packages.component';

describe('SubscribePackagesComponent', () => {
  let component: SubscribePackagesComponent;
  let fixture: ComponentFixture<SubscribePackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribePackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
