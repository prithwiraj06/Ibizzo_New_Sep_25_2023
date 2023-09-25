import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerImageGalleryComponent } from './partner-image-gallery.component';

describe('PartnerImageGalleryComponent', () => {
  let component: PartnerImageGalleryComponent;
  let fixture: ComponentFixture<PartnerImageGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerImageGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerImageGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
