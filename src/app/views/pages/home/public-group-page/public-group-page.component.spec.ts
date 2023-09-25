import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicGroupPageComponent } from './public-group-page.component';

describe('PublicGroupPageComponent', () => {
  let component: PublicGroupPageComponent;
  let fixture: ComponentFixture<PublicGroupPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicGroupPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicGroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
