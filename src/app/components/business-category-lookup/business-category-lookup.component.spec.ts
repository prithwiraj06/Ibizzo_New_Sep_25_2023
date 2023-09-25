import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCategoryLookupComponent } from './business-category-lookup.component';

describe('BusinessCategoryLookupComponent', () => {
  let component: BusinessCategoryLookupComponent;
  let fixture: ComponentFixture<BusinessCategoryLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessCategoryLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCategoryLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
