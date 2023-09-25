import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodesListsComponent } from './codes-lists.component';

describe('CodesListsComponent', () => {
  let component: CodesListsComponent;
  let fixture: ComponentFixture<CodesListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodesListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodesListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
