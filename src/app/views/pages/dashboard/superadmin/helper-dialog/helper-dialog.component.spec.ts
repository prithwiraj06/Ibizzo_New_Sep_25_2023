import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperDialogComponent } from './helper-dialog.component';

describe('HelperDialogComponent', () => {
  let component: HelperDialogComponent;
  let fixture: ComponentFixture<HelperDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelperDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelperDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
