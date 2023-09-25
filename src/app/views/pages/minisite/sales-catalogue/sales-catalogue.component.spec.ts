import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCatalogueComponent } from './sales-catalogue.component';

describe('SalesCatalogueComponent', () => {
  let component: SalesCatalogueComponent;
  let fixture: ComponentFixture<SalesCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
