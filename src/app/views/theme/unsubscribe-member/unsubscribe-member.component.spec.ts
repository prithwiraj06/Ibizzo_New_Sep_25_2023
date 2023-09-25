import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeMemberComponent } from './unsubscribe-member.component';

describe('UnsubscribeMemberComponent', () => {
  let component: UnsubscribeMemberComponent;
  let fixture: ComponentFixture<UnsubscribeMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribeMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
