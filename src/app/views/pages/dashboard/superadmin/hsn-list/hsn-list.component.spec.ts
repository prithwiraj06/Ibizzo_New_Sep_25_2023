import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnListComponent } from './hsn-list.component';

describe('HsnListComponent', () => {
  let component: HsnListComponent;
  let fixture: ComponentFixture<HsnListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
