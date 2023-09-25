import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReInviteComponent } from './re-invite.component';

describe('ReInviteComponent', () => {
  let component: ReInviteComponent;
  let fixture: ComponentFixture<ReInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
