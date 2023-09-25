import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerImagesComponent } from './partner-images.component';

describe('PartnerImagesComponent', () => {
  let component: PartnerImagesComponent;
  let fixture: ComponentFixture<PartnerImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
