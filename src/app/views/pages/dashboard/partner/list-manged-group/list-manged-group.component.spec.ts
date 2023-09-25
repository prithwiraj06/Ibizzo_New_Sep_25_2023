import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMangedGroupComponent } from './list-manged-group.component';

describe('ListMangedGroupComponent', () => {
  let component: ListMangedGroupComponent;
  let fixture: ComponentFixture<ListMangedGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMangedGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMangedGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
