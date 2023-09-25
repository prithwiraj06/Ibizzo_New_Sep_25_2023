import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDiscriptionComponent } from './update-discription.component';

describe('UpdateDiscriptionComponent', () => {
  let component: UpdateDiscriptionComponent;
  let fixture: ComponentFixture<UpdateDiscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDiscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDiscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
