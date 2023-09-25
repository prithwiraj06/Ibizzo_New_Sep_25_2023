import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingRfqComponent } from './listing-rfq.component';

describe('ListingRfqComponent', () => {
  let component: ListingRfqComponent;
  let fixture: ComponentFixture<ListingRfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
