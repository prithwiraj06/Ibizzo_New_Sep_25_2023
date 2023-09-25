import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OranizationLookupsComponent } from './oranization-lookups.component';

describe('OranizationLookupsComponent', () => {
  let component: OranizationLookupsComponent;
  let fixture: ComponentFixture<OranizationLookupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OranizationLookupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OranizationLookupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
