import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBusinessListComponent } from './custom-business-list.component';

describe('CustomBusinessListComponent', () => {
  let component: CustomBusinessListComponent;
  let fixture: ComponentFixture<CustomBusinessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomBusinessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBusinessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
