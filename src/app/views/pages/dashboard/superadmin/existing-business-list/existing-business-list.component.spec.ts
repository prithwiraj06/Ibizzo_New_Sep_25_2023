import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingBusinessListComponent } from './existing-business-list.component';

describe('ExistingBusinessListComponent', () => {
  let component: ExistingBusinessListComponent;
  let fixture: ComponentFixture<ExistingBusinessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingBusinessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingBusinessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
