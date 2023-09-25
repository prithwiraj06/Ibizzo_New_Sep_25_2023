import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnLookupComponent } from './hsn-lookup.component';

describe('HsnLookupComponent', () => {
  let component: HsnLookupComponent;
  let fixture: ComponentFixture<HsnLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
