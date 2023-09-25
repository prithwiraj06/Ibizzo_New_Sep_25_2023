import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMembersComponent } from './partner-members.component';

describe('PartnerMembersComponent', () => {
  let component: PartnerMembersComponent;
  let fixture: ComponentFixture<PartnerMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
