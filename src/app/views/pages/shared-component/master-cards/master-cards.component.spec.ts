import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCardsComponent } from './master-cards.component';

describe('MasterCardsComponent', () => {
  let component: MasterCardsComponent;
  let fixture: ComponentFixture<MasterCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
