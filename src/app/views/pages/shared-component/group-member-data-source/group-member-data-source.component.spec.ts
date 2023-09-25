import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberDataSourceComponent } from './group-member-data-source.component';

describe('GroupMemberDataSourceComponent', () => {
  let component: GroupMemberDataSourceComponent;
  let fixture: ComponentFixture<GroupMemberDataSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMemberDataSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMemberDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
