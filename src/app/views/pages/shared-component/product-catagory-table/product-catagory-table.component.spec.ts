import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCatagoryTableComponent } from './product-catagory-table.component';

describe('ProductCatagoryTableComponent', () => {
  let component: ProductCatagoryTableComponent;
  let fixture: ComponentFixture<ProductCatagoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCatagoryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCatagoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
