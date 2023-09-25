import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMemberSuperAdminComponent } from './partner-member-super-admin.component';

describe('PartnerMemberSuperAdminComponent', () => {
  let component: PartnerMemberSuperAdminComponent;
  let fixture: ComponentFixture<PartnerMemberSuperAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerMemberSuperAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerMemberSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
