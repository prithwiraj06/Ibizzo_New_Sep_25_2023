import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClusterGroupComponent } from './create-cluster-group.component';

describe('CreateClusterGroupComponent', () => {
  let component: CreateClusterGroupComponent;
  let fixture: ComponentFixture<CreateClusterGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClusterGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClusterGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
