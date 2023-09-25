import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsPromotesDeskComponent } from './leads-promotes-desk.component';

describe('LeadsPromotesDeskComponent', () => {
  let component: LeadsPromotesDeskComponent;
  let fixture: ComponentFixture<LeadsPromotesDeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsPromotesDeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsPromotesDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
