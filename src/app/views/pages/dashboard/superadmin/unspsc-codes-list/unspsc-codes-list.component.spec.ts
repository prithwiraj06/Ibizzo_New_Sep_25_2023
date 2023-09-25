import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnspscCodesListComponent } from './unspsc-codes-list.component';

describe('UnspscCodesListComponent', () => {
  let component: UnspscCodesListComponent;
  let fixture: ComponentFixture<UnspscCodesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnspscCodesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnspscCodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
