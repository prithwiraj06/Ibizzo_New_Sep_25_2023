import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisiteHeaderComponent } from './minisite-header.component';

describe('MinisiteHeaderComponent', () => {
  let component: MinisiteHeaderComponent;
  let fixture: ComponentFixture<MinisiteHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinisiteHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinisiteHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
