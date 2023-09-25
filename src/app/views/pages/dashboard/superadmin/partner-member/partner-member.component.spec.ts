import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMemberComponent } from './partner-member.component';

describe('PartnerMemberComponent', () => {
  let component: PartnerMemberComponent;
  let fixture: ComponentFixture<PartnerMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
