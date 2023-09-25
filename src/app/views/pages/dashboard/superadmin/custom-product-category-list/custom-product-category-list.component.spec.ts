import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomProductCategoryListComponent } from './custom-product-category-list.component';

describe('CustomProductCategoryListComponent', () => {
  let component: CustomProductCategoryListComponent;
  let fixture: ComponentFixture<CustomProductCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomProductCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomProductCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
