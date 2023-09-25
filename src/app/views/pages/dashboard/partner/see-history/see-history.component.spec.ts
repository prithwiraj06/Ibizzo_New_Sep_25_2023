import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeHistoryComponent } from './see-history.component';

describe('SeeHistoryComponent', () => {
  let component: SeeHistoryComponent;
  let fixture: ComponentFixture<SeeHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
