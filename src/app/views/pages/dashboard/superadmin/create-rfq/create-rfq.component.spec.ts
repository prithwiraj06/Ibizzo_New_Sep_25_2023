import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRfqComponent } from './create-rfq.component';

describe('CreateRfqComponent', () => {
  let component: CreateRfqComponent;
  let fixture: ComponentFixture<CreateRfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
