import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualInviteComponent } from './individual-invite.component';

describe('IndividualInviteComponent', () => {
  let component: IndividualInviteComponent;
  let fixture: ComponentFixture<IndividualInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
