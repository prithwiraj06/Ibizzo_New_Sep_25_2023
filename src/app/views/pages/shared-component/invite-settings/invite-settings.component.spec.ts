import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteSettingsComponent } from './invite-settings.component';

describe('InviteSettingsComponent', () => {
  let component: InviteSettingsComponent;
  let fixture: ComponentFixture<InviteSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
