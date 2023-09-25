import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicObjectValueComponent } from './dynamic-object-value.component';

describe('DynamicObjectValueComponent', () => {
  let component: DynamicObjectValueComponent;
  let fixture: ComponentFixture<DynamicObjectValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicObjectValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicObjectValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
