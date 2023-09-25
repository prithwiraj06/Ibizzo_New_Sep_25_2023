import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationLookupsComponent } from './location-lookups.component';

describe('LocationLookupsComponent', () => {
  let component: LocationLookupsComponent;
  let fixture: ComponentFixture<LocationLookupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationLookupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationLookupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
