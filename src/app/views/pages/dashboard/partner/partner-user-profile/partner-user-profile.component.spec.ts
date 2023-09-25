import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerUserProfileComponent } from './partner-user-profile.component';

describe('PartnerUserProfileComponent', () => {
  let component: PartnerUserProfileComponent;
  let fixture: ComponentFixture<PartnerUserProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerUserProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
