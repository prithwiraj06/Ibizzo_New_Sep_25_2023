import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerProductsComponent } from './partner-products.component';

describe('PartnerProductsComponent', () => {
  let component: PartnerProductsComponent;
  let fixture: ComponentFixture<PartnerProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
