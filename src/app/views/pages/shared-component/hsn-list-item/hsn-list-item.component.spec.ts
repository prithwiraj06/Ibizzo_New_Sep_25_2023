import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnListItemComponent } from './hsn-list-item.component';

describe('HsnListItemComponent', () => {
  let component: HsnListItemComponent;
  let fixture: ComponentFixture<HsnListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
