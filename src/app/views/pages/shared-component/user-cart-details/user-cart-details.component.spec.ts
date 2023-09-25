import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCartDetailsComponent } from './user-cart-details.component';

describe('UserCartDetailsComponent', () => {
  let component: UserCartDetailsComponent;
  let fixture: ComponentFixture<UserCartDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCartDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
